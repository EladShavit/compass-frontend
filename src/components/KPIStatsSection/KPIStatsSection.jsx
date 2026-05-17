import KPICard from '../KPICard/KPICard'
import styles from './KPIStatsSection.module.css'

export default function KPIStatsSection() {
  return (
    <section className={styles.grid} aria-label="Key Performance Indicators">
      {/* Wide card – Total Balance */}
      <div className={styles.wide}>
        <KPICard
          icon="account_balance"
          iconColor="secondary"
          label="Total Balance"
          value="$1,248,590.00"
          badge="2.4%"
          badgeColor="secondary"
          wide
        />
      </div>

      {/* Savings */}
      <KPICard
        icon="savings"
        iconColor="tertiary"
        label="Savings"
        value="$342,100.50"
      />

      {/* Monthly Expenses */}
      <KPICard
        icon="credit_card"
        iconColor="error"
        label="Monthly Expenses"
        value="$12,450.00"
      />
    </section>
  )
}
