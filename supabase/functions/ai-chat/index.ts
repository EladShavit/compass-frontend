// Edge Function: ai-chat
// Personal finance AI assistant. Receives the user's message + recent transaction
// context, calls OpenAI server-side, persists the exchange, and returns the reply.
// The OpenAI API key is read from a Supabase secret — never exposed to the client.

import { createClient } from 'jsr:@supabase/supabase-js@2'

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const SYSTEM_PROMPT = `You are Compass, a friendly and concise personal finance assistant.
The user has connected their bank account and you have access to their recent transaction data (provided in each message).
Your role: answer questions about their spending, find patterns, give practical money-saving tips, and help them understand their finances.
Guidelines:
- Be conversational and concise (2–4 sentences for most replies).
- Reference specific transaction data when relevant (merchant names, amounts, dates).
- Amounts are in Israeli Shekel (₪) unless specified otherwise.
- Never give legal, tax, or investment advice — suggest consulting a professional for those.
- If the transactions array is empty, say you don't see any transactions yet and ask the user to upload a statement.
- Reply in the same language the user used (Hebrew or English).`

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS })
  }

  try {
    if (!OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: 'OPENAI_API_KEY is not configured' }), {
        status: 500,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      })
    }

    // Verify JWT and get the user
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      })
    }

    const { message, sessionId, transactions = [], history = [] } = await req.json()

    if (!message || typeof message !== 'string' || !message.trim()) {
      return new Response(JSON.stringify({ error: 'message is required' }), {
        status: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      })
    }

    // Build transaction context string (capped to keep tokens manageable)
    const txSummary = transactions.slice(0, 50).map((tx: Record<string, unknown>) =>
      `${tx.date} | ${tx.direction === 'debit' ? '-' : '+'}₪${Number(tx.amount).toFixed(2)} | ${tx.description} | ${(tx as Record<string, { name?: string }>).categories?.name ?? 'Uncategorized'}`
    ).join('\n')

    const contextBlock = txSummary
      ? `\n\nRecent transactions (up to 50):\n${txSummary}`
      : '\n\nNo transactions available yet.'

    // Build message history (last 10 turns to limit tokens)
    const recentHistory = history.slice(-10).map((m: { role: string; content: string }) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }))

    const openaiMessages = [
      { role: 'system' as const, content: SYSTEM_PROMPT + contextBlock },
      ...recentHistory,
      { role: 'user' as const, content: message.trim() },
    ]

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.7,
        max_tokens: 400,
        messages: openaiMessages,
      }),
    })

    if (!openaiRes.ok) {
      const errBody = await openaiRes.text()
      return new Response(JSON.stringify({ error: `OpenAI error: ${errBody}` }), {
        status: 502,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      })
    }

    const completion = await openaiRes.json()
    const reply = completion.choices?.[0]?.message?.content ?? "I'm sorry, I couldn't generate a response."

    // Persist both turns (best-effort, don't fail the request if this errors)
    const sid = sessionId || crypto.randomUUID()
    try {
      await supabase.from('chat_messages').insert([
        { user_id: user.id, session_id: sid, role: 'user', content: message.trim() },
        { user_id: user.id, session_id: sid, role: 'assistant', content: reply },
      ])
    } catch (_) {
      // non-fatal
    }

    return new Response(JSON.stringify({ reply, sessionId: sid }), {
      status: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }
})
