import { useState } from 'react'
import AlertItem from '../AlertItem/AlertItem'
import AlertReviewModal from '../AlertReviewModal/AlertReviewModal'
import { useLanguage } from '../../context/LanguageContext'
import styles from './AlertsListSection.module.css'

export default function AlertsListSection({ activeFilter = 'all', alerts = [], onDismiss }) {
  const { t } = useLanguage()
  const [reviewing, setReviewing] = useState(null)

  const getAlertType = (a) => {
    if (a._type) return a._type
    const s = a.alert_categories?.default_severity?.toLowerCase()
    if (s === 'critical') return 'critical'
    if (s === 'opportunity') return 'opportunities'
    if (s === 'warning') return 'duplicates'
    return 'other'
  }

  const filtered = activeFilter === 'all'
    ? alerts
    : alerts.filter((a) => getAlertType(a) === activeFilter)

  const formatTimestamp = (dateStr) => new Date(dateStr).toLocaleDateString()

  const getAlertColor = (severity) => {
    const s = severity?.toLowerCase()
    if (s === 'critical') return 'error'
    if (s === 'warning') return 'tertiary'
    if (s === 'opportunity') return 'secondary'
    return 'primary'
  }

  return (
    <>
      <div className={styles.list} role="list">
        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--color-outline)' }}>
              check_circle
            </span>
            <p>{t('alerts_none_in_category')}</p>
          </div>
        ) : (
          filtered.map((alert) => {
            const color = getAlertColor(alert.alert_categories?.default_severity)
            return (
              <AlertItem
                key={alert.alert_id}
                accentColor={color}
                icon={alert.alert_categories?.default_severity?.toLowerCase() === 'critical' ? 'warning' : 'info'}
                iconColor={color}
                severityLabel={alert.alert_categories?.name}
                timestamp={formatTimestamp(alert.created_at)}
                title={alert.title}
                description={alert.description}
                primaryLabel={t('alerts_review')}
                primaryVariant={color}
                onPrimary={() => setReviewing(alert)}
                secondaryLabel={t('alerts_dismiss')}
                onSecondary={() => onDismiss && onDismiss(alert.alert_id)}
              />
            )
          })
        )}
      </div>

      <AlertReviewModal
        alert={reviewing}
        open={!!reviewing}
        onClose={() => setReviewing(null)}
        onDismiss={(id) => { onDismiss && onDismiss(id); setReviewing(null) }}
      />
    </>
  )
}
