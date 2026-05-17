import styles from './AlertSeverityTag.module.css'

/**
 * AlertSeverityTag — small color-coded badge: "Critical Security", "Yield Optimization", etc.
 * color: 'error' | 'secondary' | 'tertiary'
 */
export default function AlertSeverityTag({ label, color = 'error' }) {
  return (
    <span className={`${styles.tag} ${styles[color]}`}>{label}</span>
  )
}
