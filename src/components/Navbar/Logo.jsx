import styles from './Logo.module.css'

export default function Logo() {
  return (
    <div className={styles.logo}>
      <span className={`material-symbols-outlined ${styles.icon}`}>explore</span>
      <span className={styles.wordmark}>Compass</span>
    </div>
  )
}
