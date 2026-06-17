// Edge Function: parse-statement
// Uses OpenAI to extract transactions from raw bank/credit-card statement text
// when the regex-based client parser fails to find any rows (e.g. unfamiliar
// statement layout). The OpenAI API key never reaches the client — it's read
// from a server-side Supabase secret.

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const SYSTEM_PROMPT = `You extract financial transactions from raw bank/credit-card statement text (often Hebrew, sometimes with garbled spacing from PDF extraction).
Return ONLY a JSON object: { "transactions": [ { "date": "YYYY-MM-DD", "amount": number, "description": string, "direction": "debit" | "credit" }, ... ] }.
Rules:
- "date" must be ISO format YYYY-MM-DD.
- "amount" is always a positive number (use "direction" to indicate debit vs credit).
- "description" should be the merchant/payee name, translated to English if it was Hebrew, title-cased.
- Skip summary/total lines, balance lines, and anything that isn't an individual transaction.
- If you cannot confidently parse any transactions, return { "transactions": [] }.`

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

    const { rawText } = await req.json()
    if (!rawText || typeof rawText !== 'string') {
      return new Response(JSON.stringify({ error: 'rawText is required' }), {
        status: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      })
    }

    // Cap input size to keep cost/latency predictable.
    const trimmedText = rawText.slice(0, 20000)

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: trimmedText },
        ],
      }),
    })

    if (!openaiRes.ok) {
      const errBody = await openaiRes.text()
      return new Response(JSON.stringify({ error: `OpenAI request failed: ${errBody}` }), {
        status: 502,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      })
    }

    const completion = await openaiRes.json()
    const content = completion.choices?.[0]?.message?.content ?? '{"transactions":[]}'

    let parsed
    try {
      parsed = JSON.parse(content)
    } catch {
      parsed = { transactions: [] }
    }

    const transactions = Array.isArray(parsed.transactions) ? parsed.transactions : []

    return new Response(JSON.stringify({ transactions }), {
      status: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }
})
