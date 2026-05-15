import styles from './LoadingSpinner.module.css'

/**
 * LoadingSpinner
 * sizes: 'sm' | 'md' | 'lg'
 * colors: 'primary' | 'secondary' | 'tertiary'
 */
export default function LoadingSpinner({ size = 'md', color = 'secondary', label = 'Loading…' }) {
  return (
    <div className={`${styles.wrapper} ${styles[size]}`} role="status" aria-label={label}>
      <div className={`${styles.ring} ${styles[color]}`} />
      <span className={styles.srOnly}>{label}</span>
    </div>
  )
}
