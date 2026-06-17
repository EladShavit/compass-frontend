import { useLanguage } from '../../context/LanguageContext'
import styles from './AboutPage.module.css'

export default function AboutPage() {
  const { t } = useLanguage()

  const PERSONAS = [
    {
      icon: 'person',
      title: t('about_persona_individual_title'),
      text: t('about_persona_individual_text'),
    },
    {
      icon: 'storefront',
      title: t('about_persona_business_title'),
      text: t('about_persona_business_text'),
    },
    {
      icon: 'trending_up',
      title: t('about_persona_investor_title'),
      text: t('about_persona_investor_text'),
    },
  ]

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1 className="text-h1">{t('about_title')}</h1>
        <p className={`text-body-md ${styles.subtitle}`}>
          {t('about_subtitle')}
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={`text-h2 ${styles.sectionTitle}`}>{t('about_mission_title')}</h2>
        <p className={`text-body-md ${styles.bodyText}`}>
          {t('about_mission_text')}
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={`text-h2 ${styles.sectionTitle}`}>{t('about_feature_title')}</h2>
        <div className={styles.featureCard}>
          <span className={`material-symbols-outlined ${styles.featureIcon}`}>warning</span>
          <div>
            <h3 className={`text-h3 ${styles.featureTitle}`}>{t('about_feature_subtitle')}</h3>
            <p className={`text-body-md ${styles.featureText}`}>
              {t('about_feature_text')}
            </p>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={`text-h2 ${styles.sectionTitle}`}>{t('about_who_for_title')}</h2>
        <div className={styles.personaGrid}>
          {PERSONAS.map((p) => (
            <div key={p.title} className={styles.personaCard}>
              <span className="material-symbols-outlined" style={{ color: 'var(--color-secondary)', fontSize: '28px' }}>
                {p.icon}
              </span>
              <h3 className={`text-h3 ${styles.personaTitle}`} style={{ marginTop: 'var(--space-sm)' }}>
                {p.title}
              </h3>
              <p className={`text-body-md ${styles.personaText}`}>{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
