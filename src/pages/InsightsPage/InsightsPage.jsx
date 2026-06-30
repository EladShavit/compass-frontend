import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTransactions } from '../../hooks/useTransactions'
import { useChartData } from '../../hooks/useChartData'
import { useBudgets } from '../../hooks/useBudgets'
import { useCurrency } from '../../context/CurrencyContext'
import ExpenseChartSection from '../../components/ExpenseChartSection/ExpenseChartSection'
import BudgetProgressSection from '../../components/BudgetProgressSection/BudgetProgressSection'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import ProGate from '../../components/ProGate/ProGate'
import { useTier } from '../../hooks/useTier'
import { useLanguage } from '../../context/LanguageContext'
import styles from './InsightsPage.module.css'

function StatCard({ icon, label, value, sub }) {
  return (
    <div className={styles.statCard}>
      <span className={`material-symbols-outlined ${styles.statIcon}`}>{icon}</span>
      <p className={styles.statLabel}>{label}</p>
      <p className={styles.statValue}>{value}</p>
      {sub && <p className={styles.statSub}>{sub}</p>}
    </div>
  )
}

export default function InsightsPage() {
  const { t, tCat } = useLanguage()
  const { isPro } = useTier()
  const { transactions, loading: txLoading } = useTransactions(500)
  const { chartData, loading: chartLoading } = useChartData()
  const { budgets } = useBudgets(transactions)
  const { formatAmount } = useCurrency()

  const stats = useMemo(() => {
    const debits = transactions.filter((t) => t.direction === 'debit')
    const credits = transactions.filter((t) => t.direction === 'credit')
    const totalSpent = debits.reduce((s, t) => s + Number(t.amount), 0)
    const totalIncome = credits.reduce((s, t) => s + Number(t.amount), 0)
    const avgTx = debits.length ? totalSpent / debits.length : 0

    const byCat = {}
    debits.forEach((t) => {
      const cat = t.categories?.name || 'Other'
      byCat[cat] = (byCat[cat] || 0) + Number(t.amount)
    })
    const topCat = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0]

    return { totalSpent, totalIncome, avgTx, topCat, txCount: debits.length }
  }, [transactions])

  const fmt = formatAmount

  if (txLoading || chartLoading) return <LoadingSpinner />

  if (!isPro) {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <h1 className="text-h1">{t('insights_title')}</h1>
          <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>
            {t('insights_subtitle')}
          </p>
        </header>
        <ProGate featureKey="progate_insights_feature">
          <div style={{ height: 320 }} />
        </ProGate>
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <h1 className="text-h1">{t('insights_title')}</h1>
        </header>
        <div className={styles.emptyState}>
          <span className="material-symbols-outlined" style={{ fontSize: 56, color: 'var(--color-primary)' }}>
            bar_chart
          </span>
          <h2 className="text-h2">{t('insights_empty_title')}</h2>
          <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)', maxWidth: 380, textAlign: 'center' }}>
            {t('insights_empty_desc')}
          </p>
          <Link to="/upload" className={styles.emptyBtn}>{t('insights_empty_cta')}</Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className="text-h1">{t('insights_title')}</h1>
        <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>
          {t('insights_subtitle')}
        </p>
      </header>

      <div className={styles.statsGrid}>
        <StatCard icon="payments" label={t('insights_total_spent')} value={fmt(stats.totalSpent)} sub={`${stats.txCount} ${t('insights_transactions_count')}`} />
        <StatCard icon="savings" label={t('insights_total_income')} value={fmt(stats.totalIncome)} />
        <StatCard icon="receipt_long" label={t('insights_avg_transaction')} value={fmt(stats.avgTx)} />
        {stats.topCat && (
          <StatCard icon="category" label={t('insights_top_category')} value={tCat(stats.topCat[0])} sub={fmt(stats.topCat[1])} />
        )}
      </div>

      <div className={styles.chartWrap}>
        <ExpenseChartSection chartData={chartData} />
      </div>

      <div className={styles.chartWrap}>
        <BudgetProgressSection budgets={budgets} />
      </div>

      <div className={styles.categoryList}>
        <h2 className="text-h3" style={{ marginBottom: 'var(--space-md)' }}>{t('insights_spending_by_category')}</h2>
        {Object.entries(
          transactions
            .filter((t) => t.direction === 'debit')
            .reduce((acc, t) => {
              const cat = t.categories?.name || 'Other'
              acc[cat] = (acc[cat] || 0) + Number(t.amount)
              return acc
            }, {})
        )
          .sort((a, b) => b[1] - a[1])
          .map(([cat, amount]) => (
            <div key={cat} className={styles.categoryRow}>
              <span className={styles.catName}>{tCat(cat)}</span>
              <span className={styles.catAmount}>{fmt(amount)}</span>
            </div>
          ))}
      </div>
    </div>
  )
}
