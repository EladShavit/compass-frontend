import StatsCard from '../StatsCard/StatsCard'
import styles from './AlertStatsSection.module.css'

export default function AlertStatsSection({ alerts = [] }) {
  const newAlertsCount = alerts.filter(a => a.status === 'New').length
  const inProgressCount = alerts.filter(a => a.status === 'InProgress').length
  const savedCount = alerts.filter(a => a.status === 'Saved').length
  const estValueImpact = alerts.reduce((acc, a) => acc + Number(a.estimated_impact || 0), 0)

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val)

  return (
    <section className={styles.grid} aria-label="Alert statistics">
      <StatsCard
        label="New Alerts"
        value={newAlertsCount.toString()}
        icon="notifications_active"
        iconColor="secondary"
        subIcon="trending_up"
        subText="+3 since last login" // Could calculate this based on last_login_at
        subColor="secondary"
        accentColor="secondary"
      />
      <StatsCard
        label="In Progress"
        value={inProgressCount.toString()}
        icon="hourglass_top"
        iconColor="tertiary"
        subText="Pending resolution"
        subColor="muted"
        accentColor="tertiary"
      />
      <StatsCard
        label="Saved for Later"
        value={savedCount.toString()}
        icon="bookmark"
        iconColor="primary"
        subText="Archived tasks"
        subColor="muted"
        accentColor="primary"
      />
      <StatsCard
        label="Est. Value Impact"
        value={formatCurrency(estValueImpact)}
        icon="account_balance"
        iconColor="secondary"
        subText="From optimization alerts"
        subColor="muted"
        accentColor="secondary"
        valueColor="secondary"
        ambientGlow
      />
    </section>
  )
}
