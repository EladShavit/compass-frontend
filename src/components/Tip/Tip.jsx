import styles from './Tip.module.css'

/**
 * Tip — a single tip row: icon + text
 * variant: 'check' | 'warning' | 'info'
 */
export default function Tip({ text, variant = 'check' }) {
  const ICONS = { check: 'check_circle', warning: 'warning', info: 'info' }
  return (
    <li className={styles.tip}>
      <span className={`material-symbols-outlined ${styles.icon} ${styles[variant]}`}>
        {ICONS[variant]}
      </span>
      <span className={styles.text}>{text}</span>
    </li>
  )
}
