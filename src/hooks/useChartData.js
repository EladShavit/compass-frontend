import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function useChartData() {
  const { session } = useAuth()
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!session) return

    async function fetchChartData() {
      try {
        const { data, error } = await supabase
          .from('chart_data_points')
          .select('*')
          .order('period_start', { ascending: true })

        if (error) throw error
        setChartData(data || [])
      } catch (err) {
        console.error('Error fetching chart data:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchChartData()
  }, [session])

  return { chartData, loading, error }
}
