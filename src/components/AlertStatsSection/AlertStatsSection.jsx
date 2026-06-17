import StatsCard from '../StatsCard/StatsCard'
import { useCurrency } from '../../context/CurrencyContext'
import { useLanguage } from '../../context/LanguageContext'
import styles from './AlertStatsSection.module.css'

export default function AlertStatsSection({ alerts = [] }) {
  const { formatAmount } = useCurrency()
  const { t } = useLanguage()
  const newAlertsCount = alerts.filter(a => a.status === 'New').length
  const inProgressCount = alerts.filter(a => a.status === 'InProgress').length
  const savedCount = alerts.filter(a => a.status === 'Saved').length
  const estValueImpact = alerts.reduce((acc, a) => acc + Number(a.estimated_impact || 0), 0)
  const formatCurrency = (val) => formatAmount(val)

  return (
    <section className={styles.grid} aria-label="Alert statistics">
      <StatsCard
        label={t('alerts_stat_new')}
        value={newAlertsCount.toString()}
        icon="notifications_active"
        iconColor="secondary"
        subIcon={newAlertsCount > 0 ? 'trending_up' : undefined}
        subText={newAlertsCount > 0 ? `${newAlertsCount} ${t('alerts_stat_new_attention')}` : t('alerts_stat_all_clear')}
        subColor={newAlertsCount > 0 ? 'secondary' : 'muted'}
        accentColor="secondary"
      />
      <StatsCard
        label={t('alerts_stat_in_progress')}
        value={inProgressCount.toString()}
        icon="hourglass_top"
        iconColor="tertiary"
        subText={t('alerts_stat_pending_resolution')}
        subColor="muted"
        accentColor="tertiary"
      />
      <StatsCard
        label={t('alerts_stat_saved')}
        value={savedCount.toString()}
        icon="bookmark"
        iconColor="primary"
        subText={t('alerts_stat_archived')}
        subColor="muted"
        accentColor="primary"
      />
      <StatsCard
        label={t('alerts_stat_value_impact')}
        value={formatCurrency(estValueImpact)}
        icon="account_balance"
        iconColor="secondary"
        subText={t('alerts_stat_from_optimization')}
        subColor="muted"
        accentColor="secondary"
        valueColor="secondary"
        ambientGlow
      />
    </section>
  )
}
