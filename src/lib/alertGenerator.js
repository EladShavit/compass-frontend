/**
 * Client-side alert generation from transaction data.
 * Since RLS blocks INSERT on the alerts table, alerts are generated in-memory
 * and merged with any DB alerts in useAlerts.
 */

// Thresholds
const LARGE_TX_ILS = 500       // single transaction above this → warning
const HIGH_CATEGORY_ILS = 2000 // category total above this → opportunity
const DUP_DAYS = 7             // window to detect duplicate charges

function stableId(...parts) {
  return 'gen-' + parts.join('|').replace(/\s+/g, '-').toLowerCase().slice(0, 80)
}

/**
 * @param {Array} transactions – raw rows from `transactions` table
 * @param {Array} budgets – enriched budget rows from useBudgets (with spent, pct, isOverBudget)
 * @returns {Array} alert objects shaped like DB alert rows (with alert_id, title, etc.)
 */
export function generateAlerts(transactions = [], budgets = []) {
  const alerts = []
  const now = new Date()

  // ── 1. Duplicate charge detection ──────────────────────────────────────────
  const txMap = {}
  for (const tx of transactions) {
    if (tx.direction !== 'debit') continue
    const key = `${tx.description}|${tx.amount}`
    if (!txMap[key]) txMap[key] = []
    txMap[key].push(tx)
  }
  for (const [key, txs] of Object.entries(txMap)) {
    if (txs.length < 2) continue
    // Check if any two share dates within DUP_DAYS
    for (let i = 0; i < txs.length; i++) {
      for (let j = i + 1; j < txs.length; j++) {
        const diff = Math.abs(new Date(txs[i].date) - new Date(txs[j].date)) / 86400000
        if (diff <= DUP_DAYS) {
          const [merchant] = key.split('|')
          alerts.push({
            alert_id: stableId('dup', merchant, txs[i].amount),
            title: `Possible duplicate charge — ${merchant}`,
            description: `₪${Number(txs[i].amount).toFixed(2)} charged twice within ${Math.round(diff) || 1} day(s). Review to confirm both are legitimate.`,
            status: 'New',
            created_at: now.toISOString(),
            estimated_impact: txs[i].amount,
            _type: 'duplicates',
            alert_categories: { name: 'Duplicate', color: 'tertiary', default_severity: 'Warning' },
          })
          break
        }
      }
    }
  }

  // ── 2. Large single transactions ───────────────────────────────────────────
  const bigTxs = transactions
    .filter(tx => tx.direction === 'debit' && Number(tx.amount) >= LARGE_TX_ILS)
    .sort((a, b) => Number(b.amount) - Number(a.amount))
    .slice(0, 3)

  for (const tx of bigTxs) {
    alerts.push({
      alert_id: stableId('large', tx.description, tx.amount, tx.date),
      title: `Large charge: ₪${Number(tx.amount).toFixed(2)} at ${tx.description}`,
      description: `A transaction of ₪${Number(tx.amount).toFixed(2)} on ${tx.date} is above your usual spending threshold. Tap Review to confirm.`,
      status: 'New',
      created_at: tx.date ? new Date(tx.date).toISOString() : now.toISOString(),
      estimated_impact: 0,
      _type: 'critical',
      alert_categories: { name: 'Large Charge', color: 'error', default_severity: 'Critical' },
    })
  }

  // ── 3. High category spending opportunities ─────────────────────────────────
  const byCategory = {}
  for (const tx of transactions) {
    if (tx.direction !== 'debit') continue
    const cat = tx.categories?.name || 'Uncategorized'
    byCategory[cat] = (byCategory[cat] || 0) + Number(tx.amount)
  }
  const topCategories = Object.entries(byCategory)
    .filter(([, total]) => total >= HIGH_CATEGORY_ILS)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)

  for (const [cat, total] of topCategories) {
    alerts.push({
      alert_id: stableId('cat', cat),
      title: `High ${cat} spending — ₪${total.toFixed(0)} total`,
      description: `Your ${cat} expenses total ₪${total.toFixed(0)}. Consider reviewing subscriptions or setting a budget to reduce costs.`,
      status: 'New',
      created_at: now.toISOString(),
      estimated_impact: Math.round(total * 0.15), // 15% potential saving
      _type: 'opportunities',
      alert_categories: { name: 'Opportunity', color: 'secondary', default_severity: 'Opportunity' },
    })
  }

  // ── 4. Over-budget and near-limit budget alerts ────────────────────────────
  for (const b of budgets) {
    if (b.isOverBudget) {
      alerts.push({
        alert_id: stableId('budget-over', b.category_name),
        title: `Over budget: ${b.category_name}`,
        description: `You've spent ₪${b.spent.toFixed(0)} on ${b.category_name} this month, which exceeds your ₪${Number(b.monthly_limit).toFixed(0)} budget by ₪${(b.spent - Number(b.monthly_limit)).toFixed(0)}.`,
        status: 'New',
        created_at: now.toISOString(),
        estimated_impact: b.spent - Number(b.monthly_limit),
        _type: 'critical',
        alert_categories: { name: 'Over Budget', color: 'error', default_severity: 'Critical' },
      })
    } else if (b.isNearLimit) {
      alerts.push({
        alert_id: stableId('budget-near', b.category_name),
        title: `Approaching budget: ${b.category_name}`,
        description: `You've used ${Math.round(b.pct)}% of your ₪${Number(b.monthly_limit).toFixed(0)} monthly budget for ${b.category_name}. Only ₪${(Number(b.monthly_limit) - b.spent).toFixed(0)} remaining.`,
        status: 'New',
        created_at: now.toISOString(),
        estimated_impact: 0,
        _type: 'opportunities',
        alert_categories: { name: 'Budget Warning', color: 'secondary', default_severity: 'Opportunity' },
      })
    }
  }

  return alerts
}
