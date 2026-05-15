import styles from './Card.module.css'

/**
 * Card — base wrapper component
 * variants: 'default' | 'glass' | 'elevated'
 */
export default function Card({
  children,
  variant = 'default',
  padding = true,
  className = '',
  ...rest
}) {
  const cls = [
    styles.card,
    styles[variant],
    padding ? styles.padded : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={cls} {...rest}>
      {children}
    </div>
  )
}
