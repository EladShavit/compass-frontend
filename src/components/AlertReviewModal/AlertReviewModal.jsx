import Modal from '../Modal/Modal'
import { useLanguage } from '../../context/LanguageContext'
import styles from './AlertReviewModal.module.css'

const SEVERITY_ICON = {
  critical:    { icon: 'warning',     color: 'var(--color-error)' },
  warning:     { icon: 'info',        color: 'var(--color-tertiary)' },
  opportunity: { icon: 'lightbulb',   color: 'var(--color-secondary)' },
}

export default function AlertReviewModal({ alert, open, onClose, onDismiss }) {
  const { t } = useLanguage()
  if (!alert) return null

  const severity = alert.alert_categories?.default_severity?.toLowerCase() || 'warning'
  const { icon, color } = SEVERITY_ICON[severity] || SEVERITY_ICON.warning

  return (
    <Modal open={open} onClose={onClose} title={t('alert_review_title')} size="md">
      <div className={styles.body}>
        {/* Icon + severity */}
        <div className={styles.iconRow}>
          <span
            className={`material-symbols-outlined ${styles.icon}`}
            style={{ color, fontVariationSettings: "'FILL' 1" }}
          >
            {icon}
          </span>
          {alert.alert_categories?.name && (
            <span className={styles.tag} style={{ borderColor: color, color }}>{alert.alert_categories.name}</span>
          )}
        </div>

        {/* Title */}
        <h3 className={`text-h3 ${styles.title}`}>{alert.title}</h3>

        {/* Description */}
        <p className={styles.desc}>{alert.description}</p>

        {/* Recommendation (if present) */}
        {alert.recommendation && (
          <div className={styles.recommendation}>
            <span className={`material-symbols-outlined ${styles.recIcon}`}>tips_and_updates</span>
            <div>
              <p className={styles.recLabel}>{t('alert_recommendation')}</p>
              <p className={styles.recText}>{alert.recommendation}</p>
            </div>
          </div>
        )}

        {/* Meta */}
        {alert.created_at && (
          <p className={styles.meta}>{new Date(alert.created_at).toLocaleDateString()}</p>
        )}

        {/* Actions */}
        <div className={styles.actions}>
          <button type="button" className={styles.closeBtn} onClick={onClose}>
            {t('alert_review_close')}
          </button>
          <button
            type="button"
            className={styles.dismissBtn}
            onClick={() => { onDismiss(alert.alert_id); onClose() }}
          >
            {t('alerts_dismiss')}
          </button>
        </div>
      </div>
    </Modal>
  )
}
