import styles from './AlertsBannerSection.module.css'

const DEFAULT_ALERTS = [
  {
    id: 1,
    type: 'warning',
    icon: 'warning',
    message: 'A suspicious transaction of $3,200 was detected from "Shopping Mall". Please confirm if this is valid.',
  },
  {
    id: 2,
    type: 'info',
    icon: 'info',
    message: 'Your monthly report for October is ready to view.',
  },
]

const TYPE_CLASSES = {
  warning: 'alertWarning',
  info:    'alertInfo',
  error:   'alertError',
}

export default function AlertsBannerSection({ alerts = DEFAULT_ALERTS, onDismiss }) {
  if (!alerts.length) return null

  return (
    <div className={styles.stack} role="region" aria-label="Alerts">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`${styles.alert} ${styles[TYPE_CLASSES[alert.type] ?? 'alertInfo']}`}
          role="alert"
        >
          <span className={`material-symbols-outlined ${styles.alertIcon}`}>{alert.icon}</span>
          <p className={styles.message}>{alert.message}</p>
          {onDismiss && (
            <button
              type="button"
              className={styles.dismissBtn}
              onClick={() => onDismiss(alert.id)}
              aria-label="Dismiss alert"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
