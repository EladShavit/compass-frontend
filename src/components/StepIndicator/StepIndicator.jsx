import styles from './StepIndicator.module.css'

/**
 * StepIndicator — shows progress through multi-step flows
 * steps: string[]
 * current: 0-based index
 */
export default function StepIndicator({ steps = [], current = 0, className = '' }) {
  return (
    <div className={`${styles.wrapper} ${className}`} aria-label="Step indicator">
      {steps.map((step, i) => {
        const done = i < current
        const active = i === current
        return (
          <div key={step} className={styles.item}>
            <div className={`${styles.circle} ${done ? styles.done : ''} ${active ? styles.active : ''}`}>
              {done ? (
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>check</span>
              ) : (
                <span>{i + 1}</span>
              )}
            </div>
            <span className={`${styles.label} ${active ? styles.activeLabel : ''}`}>{step}</span>
            {i < steps.length - 1 && <div className={`${styles.connector} ${done ? styles.connectorDone : ''}`} />}
          </div>
        )
      })}
    </div>
  )
}
