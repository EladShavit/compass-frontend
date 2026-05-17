import StatsCard from '../StatsCard/StatsCard'
import styles from './AlertStatsSection.module.css'

export default function AlertStatsSection() {
  return (
    <section className={styles.grid} aria-label="Alert statistics">
      <StatsCard
        label="New Alerts"
        value="12"
        icon="notifications_active"
        iconColor="secondary"
        subIcon="trending_up"
        subText="+3 since last login"
        subColor="secondary"
        accentColor="secondary"
      />
      <StatsCard
        label="In Progress"
        value="5"
        icon="hourglass_top"
        iconColor="tertiary"
        subText="Pending resolution"
        subColor="muted"
        accentColor="tertiary"
      />
      <StatsCard
        label="Saved for Later"
        value="8"
        icon="bookmark"
        iconColor="primary"
        subText="Archived tasks"
        subColor="muted"
        accentColor="primary"
      />
      <StatsCard
        label="Est. Value Impact"
        value="$14.2K"
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
