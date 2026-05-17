import styles from './InstitutionButton.module.css'

/**
 * InstitutionButton — single bank/institution quick-select pill
 * selected: bool
 */
export default function InstitutionButton({ label, icon, selected = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${styles.btn} ${selected ? styles.selected : ''}`}
      aria-pressed={selected}
    >
      {icon && <span className={`material-symbols-outlined ${styles.icon}`}>{icon}</span>}
      <span className={styles.label}>{label}</span>
    </button>
  )
}
