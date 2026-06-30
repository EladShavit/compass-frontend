import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

// Returns last N months as { period_label: 'Jan 2026', value: 0 } buckets
function buildEmptyMonths(n = 6) {
  const buckets = []
  const now = new Date()
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const label = d.toLocaleString('en', { month: 'short', year: 'numeric' })
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    buckets.push({ period_label: label, key, value: 0 })
  }
  return buckets
}

export function useChartData() {
  const { session } = useAuth()
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!session) return

    async function fetchChartData() {
      try {
        // Fetch last 6 months of debit transactions
        const sixMonthsAgo = new Date()
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5)
        sixMonthsAgo.setDate(1)
        const fromDate = sixMonthsAgo.toISOString().split('T')[0]

        const { data, error: txError } = await supabase
          .from('transactions')
          .select('date, amount, direction')
          .eq('direction', 'debit')
          .gte('date', fromDate)
          .order('date', { ascending: true })

        if (txError) throw txError

        // Build month buckets and accumulate
        const buckets = buildEmptyMonths(6)
        for (const tx of data || []) {
          const d = new Date(tx.date)
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
          const bucket = buckets.find(b => b.key === key)
          if (bucket) bucket.value += Number(tx.amount) || 0
        }

        // Only return months with data or the current month
        const now = new Date()
        const currentKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
        const result = buckets.filter(b => b.value > 0 || b.key === currentKey)

        setChartData(result.map(({ period_label, value }) => ({ period_label, value })))
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
