import styles from './Button.module.css'

/**
 * Button
 * variants: 'primary' | 'secondary' | 'ghost'
 * sizes:    'sm' | 'md' | 'lg'
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  fullWidth = false,
  disabled = false,
  icon = null,
  iconPosition = 'right',
  onClick,
  className = '',
  ...rest
}) {
  const cls = [
    styles.btn,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <button
      type={type}
      className={cls}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {icon && iconPosition === 'left' && (
        <span className={`material-symbols-outlined ${styles.icon}`}>{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <span className={`material-symbols-outlined ${styles.icon}`}>{icon}</span>
      )}
    </button>
  )
}
