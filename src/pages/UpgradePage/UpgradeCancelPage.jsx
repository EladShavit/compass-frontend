import { Link } from 'react-router-dom'
import styles from './UpgradePage.module.css'

export default function UpgradeCancelPage() {
  return (
    <div className={styles.page}>
      <div className={styles.card} style={{ textAlign: 'center', alignItems: 'center' }}>
        <span className="material-symbols-outlined" style={{ fontSize: 64, color: 'var(--color-on-surface-variant)' }}>
          cancel
        </span>
        <h1 className="text-h1" style={{ color: 'var(--color-on-surface)' }}>
          Upgrade cancelled
        </h1>
        <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)', maxWidth: 380 }}>
          No charge was made. You're still on the Free plan. You can upgrade any time.
        </p>
        <Link to="/upgrade" className={styles.cta} style={{ textDecoration: 'none', width: 'auto', paddingInline: 32 }}>
          <span className="material-symbols-outlined">workspace_premium</span>
          Try again
        </Link>
        <Link to="/dashboard" className={styles.backLink}>Back to Dashboard</Link>
      </div>
    </div>
  )
}
