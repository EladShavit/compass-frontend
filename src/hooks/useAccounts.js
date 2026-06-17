import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function useAccounts() {
  const { session } = useAuth()
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAccounts = useCallback(async () => {
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
  }, [])

  useEffect(() => {
    if (!session) return
    fetchAccounts()
  }, [session, fetchAccounts])

  return { accounts, loading, error, refetch: fetchAccounts }
}
