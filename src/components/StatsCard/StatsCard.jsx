import styles from './StatsCard.module.css'

/**
 * StatsCard — one KPI tile in the 4-col bento grid
 *
 * Props:
 *  label      string   — ALLCAPS label
 *  value      string   — big number / value
 *  icon       string   — Material Symbol name
 *  iconColor  'secondary' | 'tertiary' | 'primary' | 'error'
 *  subIcon    string?  — small icon before subtext
 *  subText    string   — bottom footnote
 *  subColor   'secondary' | 'on-surface-variant' (default)
 *  accentColor 'secondary' | 'tertiary' | 'primary' — top hover bar color
 *  valueColor  string? — override value color (e.g. secondary)
 *  ambientGlow bool    — render ambient orb (used by EST. VALUE card)
 */
export default function StatsCard({
  label,
  value,
  icon,
  iconColor = 'secondary',
  subIcon,
  subText,
  subColor = 'muted',
  accentColor = 'secondary',
  valueColor,
  ambientGlow = false,
}) {
  return (
    <div className={styles.card}>
      {/* Hover accent bar */}
      <div className={`${styles.accentBar} ${styles[`accent-${accentColor}`]}`} aria-hidden="true" />

      {/* Ambient glow for value card */}
      {ambientGlow && <div className={styles.glow} aria-hidden="true" />}

      {/* Label + Icon row */}
      <div className={styles.topRow}>
        <span className={`text-label-caps ${styles.label}`}>{label}</span>
        <span className={`material-symbols-outlined ${styles.icon} ${styles[`icon-${iconColor}`]}`}>
          {icon}
        </span>
      </div>

      {/* Big value */}
      <div
        className={`${styles.value} ${valueColor ? styles[`value-${valueColor}`] : ''}`}
      >
        {value}
      </div>

      {/* Sub-text */}
      <div className={`${styles.sub} ${styles[`sub-${subColor}`]}`}>
        {subIcon && (
          <span className={`material-symbols-outlined ${styles.subIcon}`}>{subIcon}</span>
        )}
        {subText}
      </div>
    </div>
  )
}
