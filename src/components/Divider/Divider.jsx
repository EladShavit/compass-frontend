import styles from './Divider.module.css'

/**
 * Divider — horizontal rule with optional label
 */
export default function Divider({ label, className = '' }) {
  if (label) {
    return (
      <div className={`${styles.dividerRow} ${className}`}>
        <div className={styles.line} />
        <span className={`${styles.label} text-label-caps`}>{label}</span>
        <div className={styles.line} />
      </div>
    )
  }
  return <hr className={`${styles.hr} ${className}`} />
}
