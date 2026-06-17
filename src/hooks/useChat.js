import { useState, useCallback, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

const EDGE_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`

export function useChat(transactions = []) {
  const { session } = useAuth()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const sessionId = useRef(crypto.randomUUID())

  const sendMessage = useCallback(async (text) => {
    if (!text?.trim() || loading) return

    const userMsg = { role: 'user', content: text.trim(), id: crypto.randomUUID() }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)
    setError(null)

    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      const token = currentSession?.access_token
      if (!token) throw new Error('Not authenticated')

      const res = await fetch(EDGE_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: text.trim(),
          sessionId: sessionId.current,
          transactions: transactions.slice(0, 50),
          history: messages.slice(-10).map(m => ({ role: m.role, content: m.content })),
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Request failed')

      if (data.sessionId) sessionId.current = data.sessionId

      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: data.reply, id: crypto.randomUUID() },
      ])
    } catch (err) {
      setError(err.message)
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: '⚠️ ' + err.message, id: crypto.randomUUID(), isError: true },
      ])
    } finally {
      setLoading(false)
    }
  }, [loading, messages, transactions])

  const reset = useCallback(() => {
    setMessages([])
    setError(null)
    sessionId.current = crypto.randomUUID()
  }, [])

  return { messages, loading, error, sendMessage, reset }
}
