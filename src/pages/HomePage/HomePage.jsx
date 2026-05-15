import styles from './HomePage.module.css'

export default function HomePage() {
  return (
    <main className={styles.root}>
      <div className={styles.badge}>
        <span className="text-label-caps">Design System Active</span>
      </div>

      <h1 className={`text-h1 ${styles.title}`}>
        Compass
      </h1>

      <p className={`text-body-lg ${styles.subtitle}`}>
        Professional investment portfolio management for high-net-worth individuals.
      </p>

      <div className={styles.tokenGrid}>
        <Token label="Primary" value="--color-primary" bg="var(--color-primary)" fg="var(--color-on-primary)" />
        <Token label="Secondary" value="--color-secondary" bg="var(--color-secondary)" fg="var(--color-on-secondary)" />
        <Token label="Tertiary" value="--color-tertiary" bg="var(--color-tertiary)" fg="var(--color-on-tertiary)" />
        <Token label="Surface" value="--color-surface-container" bg="var(--color-surface-container)" fg="var(--color-on-surface)" />
        <Token label="Error" value="--color-error" bg="var(--color-error)" fg="var(--color-on-error)" />
        <Token label="Outline" value="--color-outline" bg="var(--color-outline)" fg="var(--color-background)" />
      </div>

      <div className={styles.info}>
        <p className="text-label-caps" style={{ color: 'var(--color-outline)' }}>
          Vite + React + React Router — Ready to build
        </p>
      </div>
    </main>
  )
}

function Token({ label, value, bg, fg }) {
  return (
    <div className={styles.token} style={{ background: bg, color: fg }}>
      <span className="text-label-caps">{label}</span>
      <span className={styles.tokenValue}>{value}</span>
    </div>
  )
}
