import { useState } from 'react'
import { Link } from 'react-router-dom'
import { redirectToCheckout } from '../../lib/stripe'
import styles from './UpgradePage.module.css'

const PRO_FEATURES = [
  { icon: 'all_inclusive', text: 'Unlimited accounts & statement uploads' },
  { icon: 'auto_awesome', text: 'AI-Powered Insights & spending analysis' },
  { icon: 'trending_up', text: 'Yield Optimization alerts' },
  { icon: 'category', text: 'Custom category creation' },
  { icon: 'support_agent', text: 'Priority support' },
]

export default function UpgradePage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleUpgrade() {
    setError('')
    setLoading(true)
    try {
      await redirectToCheckout()
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.badge}>
          <span className="material-symbols-outlined">workspace_premium</span>
          Compass Pro
        </div>

        <h1 className={`text-h1 ${styles.title}`}>Unlock the full experience</h1>
        <p className={`text-body-md ${styles.subtitle}`}>
          Everything in Free, plus powerful features to take control of your finances.
        </p>

        <ul className={styles.featureList}>
          {PRO_FEATURES.map((f) => (
            <li key={f.text} className={styles.featureItem}>
              <span className={`material-symbols-outlined ${styles.featureIcon}`}>{f.icon}</span>
              <span className="text-body-md">{f.text}</span>
            </li>
          ))}
        </ul>

        <div className={styles.priceRow}>
          <span className={styles.price}>₪39.90</span>
          <span className={`text-body-md ${styles.period}`}>/ month</span>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button
          className={styles.cta}
          onClick={handleUpgrade}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="material-symbols-outlined" style={{ animation: 'spin 1s linear infinite' }}>progress_activity</span>
              Redirecting to checkout…
            </>
          ) : (
            <>
              <span className="material-symbols-outlined">lock_open</span>
              Upgrade to Pro — ₪39.90/month
            </>
          )}
        </button>

        <p className={styles.cancelNote}>
          Cancel anytime. No long-term commitment.
        </p>

        <Link to="/dashboard" className={styles.backLink}>← Back to Dashboard</Link>
      </div>
    </div>
  )
}
