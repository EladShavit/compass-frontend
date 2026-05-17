import styles from './AlertActionButton.module.css'

/**
 * AlertActionButton — primary CTA on an alert card
 * variant: 'error' | 'secondary' | 'tertiary' | 'ghost'
 */
export default function AlertActionButton({ children, variant = 'secondary', onClick }) {
  return (
    <button
      type="button"
      className={`${styles.btn} ${styles[variant]}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
