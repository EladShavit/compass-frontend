import styles from './KPICard.module.css'

/**
 * KPICard — dashboard metric card
 *
 * Props:
 *  icon        string  – Material Symbol name
 *  iconColor   'primary' | 'secondary' | 'tertiary' | 'error'
 *  label       string  – ALLCAPS label above value
 *  value       string  – formatted metric value
 *  badge       string? – e.g. "↑ 2.4%" — shown as a pill in top-right
 *  badgeColor  'secondary' | 'error' | 'tertiary'
 *  wide        bool    – span 2 columns (bento layout)
 */
export default function KPICard({
  icon,
  iconColor = 'primary',
  label,
  value,
  badge,
  badgeColor = 'secondary',
  wide = false,
  className = '',
}) {
  return (
    <div className={`${styles.card} ${wide ? styles.wide : ''} ${className}`}>
      {/* Ambient orb */}
      <div className={`${styles.orb} ${styles[`orb-${iconColor}`]}`} aria-hidden="true" />

      {/* Top row */}
      <div className={styles.topRow}>
        <div className={`${styles.iconBox} ${styles[`icon-${iconColor}`]}`}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        {badge && (
          <span className={`${styles.badge} ${styles[`badge-${badgeColor}`]}`}>
            <span className={`material-symbols-outlined ${styles.badgeIcon}`}>
              {badgeColor === 'error' ? 'arrow_downward' : 'arrow_upward'}
            </span>
            {badge}
          </span>
        )}
      </div>

      {/* Bottom content */}
      <div className={styles.content}>
        <p className={`text-label-caps ${styles.label}`}>{label}</p>
        <p className={`tabular-nums ${wide ? styles.valueWide : styles.value}`}>{value}</p>
      </div>
    </div>
  )
}
