import KPICard from '../KPICard/KPICard'
import { useCurrency } from '../../context/CurrencyContext'
import { useLanguage } from '../../context/LanguageContext'
import styles from './KPIStatsSection.module.css'

export default function KPIStatsSection({ accounts = [], transactions = [] }) {
  const { formatAmount } = useCurrency()
  const { t } = useLanguage()

  const totalBalance = accounts.reduce((acc, a) => acc + Number(a.balance), 0)

  // Balance-weighted average growth — only include accounts that have a non-zero growth_pct
  const accountsWithGrowth = accounts.filter(a => a.growth_pct != null && Number(a.growth_pct) !== 0)
  const totalGrowth = accountsWithGrowth.length > 0 && totalBalance !== 0
    ? accountsWithGrowth.reduce((acc, a) => acc + Number(a.balance) * Number(a.growth_pct), 0) / totalBalance
    : null

  const savingsAccounts = accounts.filter(a => a.type === 'Savings')
  const totalSavings = savingsAccounts.reduce((acc, a) => acc + Number(a.balance), 0)

  const now = new Date()
  const currentMonthTx = transactions.filter((tx) => {
    if (tx.direction !== 'debit') return false
    const d = new Date(tx.date)
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
  })
  const monthlyExpenses = currentMonthTx.reduce((sum, tx) => sum + Number(tx.amount), 0)

  // Previous month expenses for trend
  const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const prevMonthTx = transactions.filter((tx) => {
    if (tx.direction !== 'debit') return false
    const d = new Date(tx.date)
    return d.getFullYear() === prevMonth.getFullYear() && d.getMonth() === prevMonth.getMonth()
  })
  const prevMonthExpenses = prevMonthTx.reduce((sum, tx) => sum + Number(tx.amount), 0)
  const expensesDelta = prevMonthExpenses > 0
    ? ((monthlyExpenses - prevMonthExpenses) / prevMonthExpenses) * 100
    : null

  const sign = (v) => v >= 0 ? '+' : '−'

  return (
    <section className={styles.grid} aria-label="Key Performance Indicators">
      <div className={styles.wide}>
        <KPICard
          icon="account_balance"
          iconColor="secondary"
          label={t('kpi_total_balance')}
          value={formatAmount(totalBalance)}
          badge={totalGrowth !== null ? `${sign(totalGrowth)}${Math.abs(totalGrowth).toFixed(1)}%` : undefined}
          badgeColor={totalGrowth !== null && totalGrowth < 0 ? 'error' : 'secondary'}
          tooltip={t('kpi_total_balance_tip')}
          wide
        />
      </div>

      <KPICard
        icon="savings"
        iconColor="tertiary"
        label={t('kpi_savings')}
        value={formatAmount(totalSavings)}
        tooltip={t('kpi_savings_tip')}
      />

      <KPICard
        icon="credit_card"
        iconColor="error"
        label={t('kpi_monthly_expenses')}
        value={formatAmount(monthlyExpenses)}
        badge={expensesDelta !== null ? `${sign(expensesDelta)}${Math.abs(expensesDelta).toFixed(1)}%` : undefined}
        badgeColor={expensesDelta !== null && expensesDelta > 0 ? 'error' : 'secondary'}
        tooltip={t('kpi_monthly_expenses_tip')}
      />
    </section>
  )
}
