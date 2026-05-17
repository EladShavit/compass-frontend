import styles from './FilterChip.module.css'

/**
 * FilterChip — pill filter button (ALL ALERTS / CRITICAL / OPPORTUNITIES / DUPLICATES)
 * active: bool — currently selected
 * dot: 'error' | 'secondary' | 'tertiary' | null — colored dot indicator
 */
export default function FilterChip({ label, active = false, dot, onClick }) {
  return (
    <button
      type="button"
      className={`${styles.chip} ${active ? styles.active : styles.inactive}`}
      onClick={onClick}
      aria-pressed={active}
    >
      {dot && <span className={`${styles.dot} ${styles[`dot-${dot}`]}`} aria-hidden="true" />}
      {label}
    </button>
  )
}
