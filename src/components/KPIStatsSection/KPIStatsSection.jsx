import KPICard from '../KPICard/KPICard'
import styles from './KPIStatsSection.module.css'

export default function KPIStatsSection({ accounts = [] }) {
  // Aggregate balance
  const totalBalance = accounts.reduce((acc, account) => acc + Number(account.balance), 0)
  
  // Aggregate savings (assuming account.type === 'Savings' or similar logic, for now we will sum savings or use 0)
  const savingsAccounts = accounts.filter(a => a.type === 'Savings')
  const totalSavings = savingsAccounts.reduce((acc, account) => acc + Number(account.balance), 0)

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)

  return (
    <section className={styles.grid} aria-label="Key Performance Indicators">
      {/* Wide card – Total Balance */}
      <div className={styles.wide}>
        <KPICard
          icon="account_balance"
          iconColor="secondary"
          label="Total Balance"
          value={formatCurrency(totalBalance)}
          badge="2.4%" // We could aggregate growth_pct here as well
          badgeColor="secondary"
          wide
        />
      </div>

      {/* Savings */}
      <KPICard
        icon="savings"
        iconColor="tertiary"
        label="Savings"
        value={formatCurrency(totalSavings)}
      />

      {/* Monthly Expenses */}
      <KPICard
        icon="credit_card"
        iconColor="error"
        label="Monthly Expenses"
        value="$12,450.00" // We'd need transactions to calculate this dynamically
      />
    </section>
  )
}
