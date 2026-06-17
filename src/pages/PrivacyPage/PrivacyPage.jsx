import { useLanguage } from '../../context/LanguageContext'
import styles from './PrivacyPage.module.css'

export default function PrivacyPage() {
  const { t } = useLanguage()

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <h1 className="text-h1">{t('privacy_title')}</h1>
        <p className={`text-body-lg ${styles.subtitle}`}>{t('privacy_subtitle')}</p>
      </header>

      <section className={styles.section}>
        <h2 className={`text-h3 ${styles.sectionTitle}`}>{t('privacy_collect_title')}</h2>
        <p className={`text-body-md ${styles.bodyText}`}>{t('privacy_collect_body')}</p>
      </section>

      <section className={styles.section}>
        <h2 className={`text-h3 ${styles.sectionTitle}`}>{t('privacy_use_title')}</h2>
        <p className={`text-body-md ${styles.bodyText}`}>{t('privacy_use_body')}</p>
      </section>

      <section className={styles.section}>
        <h2 className={`text-h3 ${styles.sectionTitle}`}>{t('privacy_share_title')}</h2>
        <p className={`text-body-md ${styles.bodyText}`}>{t('privacy_share_body')}</p>
      </section>

      <section className={styles.section}>
        <h2 className={`text-h3 ${styles.sectionTitle}`}>{t('privacy_security_title')}</h2>
        <p className={`text-body-md ${styles.bodyText}`}>{t('privacy_security_body')}</p>
      </section>

      <section className={styles.section}>
        <h2 className={`text-h3 ${styles.sectionTitle}`}>{t('privacy_contact_title')}</h2>
        <p className={`text-body-md ${styles.bodyText}`}>{t('privacy_contact_body')}</p>
      </section>

      <p className={styles.updated}>{t('privacy_updated')}</p>
    </div>
  )
}
