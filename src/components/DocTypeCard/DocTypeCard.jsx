import styles from './DocTypeCard.module.css'

/**
 * DocTypeCard — selectable document type card
 * active: bool — highlighted/selected state
 */
export default function DocTypeCard({ icon, title, description, active = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${styles.card} ${active ? styles.active : ''}`}
      aria-pressed={active}
    >
      {active && <div className={styles.activeGlow} aria-hidden="true" />}
      <span className={`material-symbols-outlined ${styles.icon} ${active ? styles.iconActive : styles.iconDefault}`}>
        {icon}
      </span>
      <div className={styles.text}>
        <span className={styles.title}>{title}</span>
        <span className={styles.desc}>{description}</span>
      </div>
    </button>
  )
}
