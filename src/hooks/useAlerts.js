import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function useAlerts(statusFilter = null) {
  const { session } = useAuth()
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!session) return

    async function fetchAlerts() {
      try {
        let query = supabase
          .from('alerts')
          .select(`
            *,
            alert_categories (
              name,
              color,
              default_severity
            )
          `)
          
        if (statusFilter) {
          query = query.eq('status', statusFilter)
        }
        
        const { data, error } = await query.order('created_at', { ascending: false })

        if (error) throw error
        setAlerts(data || [])
      } catch (err) {
        console.error('Error fetching alerts:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAlerts()
  }, [session])

  async function dismissAlert(alertId) {
    try {
      const { error } = await supabase
        .from('alerts')
        .update({ status: 'Dismissed', is_read: true })
        .eq('alert_id', alertId)

      if (error) throw error
      setAlerts(prev => prev.filter(a => a.alert_id !== alertId))
    } catch (err) {
      console.error('Error dismissing alert:', err)
    }
  }

  return { alerts, loading, error, dismissAlert }
}
