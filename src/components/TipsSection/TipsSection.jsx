import Tip from '../Tip/Tip'
import styles from './TipsSection.module.css'

const TIPS = [
  { text: 'Ensure all document pages are included in a single file.' },
  { text: 'Scans must be flat, well-lit, and legible without cropping.' },
  { text: 'Remove password protection from PDFs before uploading.' },
]

export default function TipsSection() {
  return (
    <aside className={styles.card}>
      {/* Header banner */}
      <div className={styles.banner} aria-hidden="true">
        <div className={styles.bannerGradient} />
        <div className={styles.bannerContent}>
          <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--color-tertiary)' }}>
            smart_toy
          </span>
          <h3 className={styles.bannerTitle}>AI Extraction Tips</h3>
        </div>
      </div>

      {/* Body */}
      <div className={styles.body}>
        <p className={styles.intro}>
          Our Compass AI automatically extracts transactional data.
          Follow these guidelines for perfect accuracy.
        </p>

        <ul className={styles.tipsList}>
          {TIPS.map((tip, i) => (
            <Tip key={i} text={tip.text} variant="check" />
          ))}
        </ul>

        {/* Encryption notice */}
        <div className={styles.encryptRow}>
          <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--color-outline-variant)' }}>
            lock
          </span>
          <span className={styles.encryptText}>End-to-end encrypted transfer</span>
        </div>
      </div>
    </aside>
  )
}
