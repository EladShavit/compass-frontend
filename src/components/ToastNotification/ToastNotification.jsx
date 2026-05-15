import { useEffect } from 'react'
import styles from './ToastNotification.module.css'

/**
 * ToastNotification
 * types: 'success' | 'error' | 'warning' | 'info'
 */
const ICONS = {
  success: 'check_circle',
  error: 'error',
  warning: 'warning',
  info: 'info',
}

export default function ToastNotification({
  message,
  type = 'info',
  visible = true,
  onClose,
  duration = 4000,
}) {
  useEffect(() => {
    if (visible && onClose) {
      const t = setTimeout(onClose, duration)
      return () => clearTimeout(t)
    }
  }, [visible, onClose, duration])

  if (!visible) return null

  return (
    <div className={`${styles.toast} ${styles[type]}`} role="alert" aria-live="assertive">
      <span className={`material-symbols-outlined ${styles.icon}`}>{ICONS[type]}</span>
      <span className={styles.message}>{message}</span>
      {onClose && (
        <button type="button" className={styles.close} onClick={onClose} aria-label="Dismiss">
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
        </button>
      )}
    </div>
  )
}
