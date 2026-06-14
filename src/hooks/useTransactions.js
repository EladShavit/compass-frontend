import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function useTransactions(limit = 10) {
  const { session } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!session) return

    async function fetchTransactions() {
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select(`
            *,
            merchants (
              name,
              logo_url
            ),
            categories (
              name,
              icon,
              color
            ),
            accounts (
              name,
              currency
            )
          `)
          .order('date', { ascending: false })
          .limit(limit)

        if (error) throw error
        setTransactions(data || [])
      } catch (err) {
        console.error('Error fetching transactions:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [session, limit])

  return { transactions, loading, error }
}
