import AlertSeverityTag from '../AlertSeverityTag/AlertSeverityTag'
import AlertActionButton from '../AlertActionButton/AlertActionButton'
import styles from './AlertItem.module.css'

/**
 * AlertItem — one alert card row
 *
 * Props:
 *  accentColor   'error' | 'secondary' | 'tertiary'
 *  icon          string — Material Symbol name
 *  iconColor     'error' | 'secondary' | 'tertiary'
 *  severityLabel string — e.g. "Critical Security"
 *  timestamp     string — e.g. "10 mins ago"
 *  title         string
 *  description   ReactNode — may contain <strong>/<em>
 *  primaryLabel  string
 *  primaryVariant 'error' | 'secondary' | 'tertiary'
 *  secondaryLabel string
 */
export default function AlertItem({
  accentColor = 'error',
  icon,
  iconColor = 'error',
  severityLabel,
  timestamp,
  title,
  description,
  primaryLabel,
  primaryVariant = 'error',
  secondaryLabel,
  onPrimary,
  onSecondary,
}) {
  return (
    <article className={styles.card}>
      {/* Left accent stripe */}
      <div className={`${styles.stripe} ${styles[`stripe-${accentColor}`]}`} aria-hidden="true" />

      {/* Icon */}
      <div className={`${styles.iconWrap} ${styles[`iconWrap-${iconColor}`]}`}>
        <span
          className="material-symbols-outlined"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {icon}
        </span>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.meta}>
          <AlertSeverityTag label={severityLabel} color={iconColor} />
          <span className={styles.timestamp}>{timestamp}</span>
        </div>
        <h3 className={`text-h3 ${styles.title}`}>{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <AlertActionButton variant={primaryVariant} onClick={onPrimary}>
          {primaryLabel}
        </AlertActionButton>
        <AlertActionButton variant="ghost" onClick={onSecondary}>
          {secondaryLabel}
        </AlertActionButton>
      </div>
    </article>
  )
}
