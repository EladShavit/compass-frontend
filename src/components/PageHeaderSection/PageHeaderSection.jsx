import styles from './PageHeaderSection.module.css'

export default function PageHeaderSection({ onCancel }) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Brand mark */}
        <div className={styles.brand}>
          <span
            className="material-symbols-outlined"
            style={{ fontSize: 32, color: 'var(--color-secondary)', fontVariationSettings: "'FILL' 1" }}
          >
            explore
          </span>
          <span className={styles.brandName}>Compass</span>
        </div>

        {/* Cancel button */}
        <button type="button" className={styles.cancelBtn} onClick={onCancel}>
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
          <span>Cancel Upload</span>
        </button>
      </div>
    </header>
  )
}
