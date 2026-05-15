import styles from './Tag.module.css'

/**
 * Tag / Chip — status indicators
 * colors: 'primary' | 'secondary' | 'tertiary' | 'error' | 'neutral'
 */
export default function Tag({
  children,
  color = 'tertiary',
  icon = null,
  className = '',
}) {
  return (
    <span className={`${styles.tag} ${styles[color]} ${className}`}>
      {icon && (
        <span className={`material-symbols-outlined ${styles.icon}`}>{icon}</span>
      )}
      {children}
    </span>
  )
}
