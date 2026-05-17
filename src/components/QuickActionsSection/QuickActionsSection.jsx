import styles from './QuickActionsSection.module.css'

const ACTIONS = [
  { icon: 'currency_exchange', label: 'Transfer Funds' },
  { icon: 'receipt_long',      label: 'Pay Bills' },
  { icon: 'add_box',           label: 'Deposit Check' },
]

export default function QuickActionsSection() {
  return (
    <section className={styles.wrapper} aria-label="Quick Actions">
      <h3 className={`text-h3 ${styles.title}`}>Quick Actions</h3>

      <div className={styles.actions}>
        {ACTIONS.map((action) => (
          <button key={action.label} type="button" className={styles.actionBtn}>
            <div className={styles.btnLeft}>
              <div className={styles.iconBox}>
                <span className="material-symbols-outlined">{action.icon}</span>
              </div>
              <span className={styles.btnLabel}>{action.label}</span>
            </div>
            <span className={`material-symbols-outlined ${styles.arrow}`}>arrow_forward</span>
          </button>
        ))}
      </div>

      {/* Drop zone */}
      <div className={styles.dropZone} role="button" tabIndex={0} aria-label="Drag and drop documents">
        <span className={`material-symbols-outlined ${styles.dropIcon}`}>cloud_upload</span>
        <p className={styles.dropText}>Drag &amp; drop documents here</p>
      </div>
    </section>
  )
}
