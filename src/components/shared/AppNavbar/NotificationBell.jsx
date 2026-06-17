import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../../context/LanguageContext'
import styles from './NotificationBell.module.css'

export default function NotificationBell({ count = 0, alerts = [], onDismiss }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const navigate = useNavigate()
  const { t } = useLanguage()

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const recent = alerts.slice(0, 5)

  const getSeverityColor = (severity) => {
    const s = severity?.toLowerCase()
    if (s === 'critical') return 'var(--color-error)'
    if (s === 'opportunity') return 'var(--color-secondary)'
    return 'var(--color-tertiary)'
  }

  return (
    <div className={styles.wrap} ref={ref}>
      <button
        className={styles.btn}
        aria-label={`Notifications${count ? `, ${count} unread` : ''}`}
        type="button"
        onClick={() => setOpen(o => !o)}
      >
        <span className={`material-symbols-outlined ${styles.icon}`}>notifications</span>
        {count > 0 && (
          <span className={styles.badge}>{count > 99 ? '99+' : count}</span>
        )}
      </button>

      {open && (
        <div className={styles.dropdown}>
          <div className={styles.dropdownHeader}>
            <span className={styles.dropdownTitle}>{t('bell_title')}</span>
            {count > 0 && <span className={styles.dropdownCount}>{count} {t('bell_unread')}</span>}
          </div>

          {recent.length === 0 ? (
            <div className={styles.empty}>
              <span className="material-symbols-outlined" style={{ fontSize: 32, color: 'var(--color-outline)' }}>notifications_none</span>
              <p>{t('bell_empty')}</p>
            </div>
          ) : (
            <div className={styles.list}>
              {recent.map(alert => (
                <div key={alert.alert_id} className={styles.item}>
                  <span
                    className={`material-symbols-outlined ${styles.itemIcon}`}
                    style={{ color: getSeverityColor(alert.alert_categories?.default_severity) }}
                  >
                    {alert.alert_categories?.default_severity?.toLowerCase() === 'critical' ? 'warning' : 'info'}
                  </span>
                  <div className={styles.itemBody}>
                    <p className={styles.itemTitle}>{alert.title}</p>
                    <p className={styles.itemDesc}>{alert.description}</p>
                  </div>
                  {onDismiss && (
                    <button
                      type="button"
                      className={styles.dismissBtn}
                      aria-label="Dismiss"
                      onClick={(e) => { e.stopPropagation(); onDismiss(alert.alert_id) }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            className={styles.viewAll}
            onClick={() => { navigate('/alerts'); setOpen(false) }}
          >
            {t('bell_view_all')}
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
          </button>
        </div>
      )}
    </div>
  )
}
