import Tip from '../Tip/Tip'
import { useLanguage } from '../../context/LanguageContext'
import styles from './TipsSection.module.css'

export default function TipsSection() {
  const { t } = useLanguage()

  const TIPS = [
    { text: t('upload_tip_1') },
    { text: t('upload_tip_2') },
    { text: t('upload_tip_3') },
  ]

  return (
    <aside className={styles.card}>
      {/* Header banner */}
      <div className={styles.banner} aria-hidden="true">
        <div className={styles.bannerGradient} />
        <div className={styles.bannerContent}>
          <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--color-tertiary)' }}>
            smart_toy
          </span>
          <h3 className={styles.bannerTitle}>{t('upload_tips_title')}</h3>
        </div>
      </div>

      {/* Body */}
      <div className={styles.body}>
        <p className={styles.intro}>
          {t('upload_tips_intro')}
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
          <span className={styles.encryptText}>{t('upload_encrypted_transfer')}</span>
        </div>
      </div>
    </aside>
  )
}
