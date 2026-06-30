import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

// Returns budgets enriched with current-month spending and progress %
export function useBudgets(transactions = []) {
  const { session } = useAuth()
  const [budgets, setBudgets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchBudgets = useCallback(async () => {
    if (!session) return
    try {
      const { data, error: err } = await supabase
        .from('budgets')
        .select('*')
        .order('category_name')
      if (err) throw err
      setBudgets(data || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [session])

  useEffect(() => { fetchBudgets() }, [fetchBudgets])

  // Compute current-month spending per category
  const now = new Date()
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  const spendByCategory = {}
  for (const tx of transactions) {
    if (tx.direction !== 'debit') continue
    const txMonth = tx.date?.slice(0, 7)
    if (txMonth !== currentMonth) continue
    const cat = tx.categories?.name || 'Uncategorized'
    spendByCategory[cat] = (spendByCategory[cat] || 0) + Number(tx.amount)
  }

  const enrichedBudgets = budgets.map((b) => {
    const spent = spendByCategory[b.category_name] || 0
    const limit = Number(b.monthly_limit)
    const pct = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0
    return { ...b, spent, pct, isOverBudget: spent > limit, isNearLimit: pct >= 80 && spent <= limit }
  })

  async function addBudget(categoryName, monthlyLimit) {
    const { error: err } = await supabase
      .from('budgets')
      .upsert({ user_id: session.user.id, category_name: categoryName, monthly_limit: monthlyLimit })
    if (err) throw err
    await fetchBudgets()
  }

  async function deleteBudget(id) {
    const { error: err } = await supabase.from('budgets').delete().eq('id', id)
    if (err) throw err
    setBudgets((prev) => prev.filter((b) => b.id !== id))
  }

  async function updateBudget(id, monthlyLimit) {
    const { error: err } = await supabase
      .from('budgets')
      .update({ monthly_limit: monthlyLimit })
      .eq('id', id)
    if (err) throw err
    await fetchBudgets()
  }

  return { budgets: enrichedBudgets, loading, error, addBudget, deleteBudget, updateBudget, refetch: fetchBudgets }
}
