import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import styles from './UpgradePage.module.css'

export default function UpgradeSuccessPage() {
  const { fetchProfile } = useAuth()
  const [done, setDone] = useState(false)

  useEffect(() => {
    // Refresh the profile so the tier update from the webhook is reflected
    const timer = setTimeout(async () => {
      await fetchProfile()
      setDone(true)
    }, 2000)
    return () => clearTimeout(timer)
  }, [fetchProfile])

  return (
    <div className={styles.page}>
      <div className={styles.card} style={{ textAlign: 'center', alignItems: 'center' }}>
        <span className="material-symbols-outlined" style={{ fontSize: 64, color: 'var(--color-secondary)' }}>
          task_alt
        </span>
        <h1 className="text-h1" style={{ color: 'var(--color-on-surface)' }}>
          Welcome to Pro! 🎉
        </h1>
        <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)', maxWidth: 380 }}>
          Your subscription is active. All Pro features are now unlocked on your account.
        </p>
        {done ? (
          <Link to="/insights" className={styles.cta} style={{ textDecoration: 'none', width: 'auto', paddingInline: 32 }}>
            <span className="material-symbols-outlined">auto_awesome</span>
            Explore AI Insights
          </Link>
        ) : (
          <p style={{ color: 'var(--color-on-surface-variant)', fontSize: 'var(--font-size-body-sm)' }}>
            Activating your account…
          </p>
        )}
        <Link to="/dashboard" className={styles.backLink}>Go to Dashboard</Link>
      </div>
    </div>
  )
}
