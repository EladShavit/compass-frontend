import { useState } from 'react'
import styles from './KPICard.module.css'

export default function KPICard({
  icon,
  iconColor = 'primary',
  label,
  value,
  badge,
  badgeColor = 'secondary',
  tooltip,
  wide = false,
  className = '',
}) {
  const [tipVisible, setTipVisible] = useState(false)

  return (
    <div className={`${styles.card} ${wide ? styles.wide : ''} ${className}`}>
      {/* Ambient orb */}
      <div className={`${styles.orb} ${styles[`orb-${iconColor}`]}`} aria-hidden="true" />

      {/* Top row */}
      <div className={styles.topRow}>
        <div className={`${styles.iconBox} ${styles[`icon-${iconColor}`]}`}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>

        <div className={styles.topRight}>
          {badge && (
            <span className={`${styles.badge} ${styles[`badge-${badgeColor}`]}`}>
              <span className={`material-symbols-outlined ${styles.badgeIcon}`}>
                {badgeColor === 'error' ? 'arrow_downward' : 'arrow_upward'}
              </span>
              {badge}
            </span>
          )}
          {tooltip && (
            <div
              className={styles.infoWrap}
              onMouseEnter={() => setTipVisible(true)}
              onMouseLeave={() => setTipVisible(false)}
              aria-label="More information"
            >
              <span className={`material-symbols-outlined ${styles.infoIcon}`}>info</span>
              {tipVisible && (
                <div className={styles.tooltip} role="tooltip">
                  {tooltip}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom content */}
      <div className={styles.content}>
        <p className={`text-label-caps ${styles.label}`}>{label}</p>
        <p className={`tabular-nums ${wide ? styles.valueWide : styles.value}`}>{value}</p>
      </div>
    </div>
  )
}
