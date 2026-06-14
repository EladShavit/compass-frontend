import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function useAccounts() {
  const { session } = useAuth()
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!session) return

    async function fetchAccounts() {
      try {
        const { data, error } = await supabase
          .from('accounts')
          .select(`
            *,
            institutions (
              name,
              logo_url
            )
          `)
          .order('created_at', { ascending: false })

        if (error) throw error
        setAccounts(data || [])
      } catch (err) {
        console.error('Error fetching accounts:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAccounts()
  }, [session])

  return { accounts, loading, error }
}
