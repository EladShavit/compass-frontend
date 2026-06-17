import { Link } from 'react-router-dom'
import styles from './ProGate.module.css'

export default function ProGate({ children, feature = 'This feature' }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.blur} aria-hidden="true">
        {children}
      </div>
      <div className={styles.overlay}>
        <span className={`material-symbols-outlined ${styles.icon}`}>lock</span>
        <h3 className={`text-h3 ${styles.title}`}>{feature}</h3>
        <p className={`text-body-md ${styles.subtitle}`}>
          Available on the Pro plan. Upgrade to unlock unlimited access.
        </p>
        <Link to="/upgrade" className={styles.cta}>
          <span className="material-symbols-outlined">workspace_premium</span>
          Upgrade to Pro
        </Link>
      </div>
    </div>
  )
}
