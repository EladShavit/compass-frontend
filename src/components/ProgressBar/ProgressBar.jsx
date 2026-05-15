import styles from './ProgressBar.module.css'

/**
 * ProgressBar
 * value: 0–100
 * colors: 'primary' | 'secondary' | 'tertiary' | 'error'
 */
export default function ProgressBar({ value = 0, color = 'secondary', label, showValue = false, className = '' }) {
  const clamped = Math.min(100, Math.max(0, value))
  return (
    <div className={`${styles.wrapper} ${className}`}>
      {(label || showValue) && (
        <div className={styles.header}>
          {label && <span className={styles.label}>{label}</span>}
          {showValue && <span className={styles.value}>{clamped}%</span>}
        </div>
      )}
      <div className={styles.track} role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100}>
        <div
          className={`${styles.fill} ${styles[color]}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  )
}
