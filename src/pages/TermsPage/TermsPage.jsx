import { useLanguage } from '../../context/LanguageContext'
import styles from './TermsPage.module.css'

export default function TermsPage() {
  const { t } = useLanguage()

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <h1 className="text-h1">{t('terms_title')}</h1>
        <p className={`text-body-lg ${styles.subtitle}`}>{t('terms_subtitle')}</p>
      </header>

      <section className={styles.section}>
        <h2 className={`text-h3 ${styles.sectionTitle}`}>{t('terms_acceptance_title')}</h2>
        <p className={`text-body-md ${styles.bodyText}`}>{t('terms_acceptance_body')}</p>
      </section>

      <section className={styles.section}>
        <h2 className={`text-h3 ${styles.sectionTitle}`}>{t('terms_use_title')}</h2>
        <p className={`text-body-md ${styles.bodyText}`}>{t('terms_use_body')}</p>
      </section>

      <section className={styles.section}>
        <h2 className={`text-h3 ${styles.sectionTitle}`}>{t('terms_account_title')}</h2>
        <p className={`text-body-md ${styles.bodyText}`}>{t('terms_account_body')}</p>
      </section>

      <section className={styles.section}>
        <h2 className={`text-h3 ${styles.sectionTitle}`}>{t('terms_liability_title')}</h2>
        <p className={`text-body-md ${styles.bodyText}`}>{t('terms_liability_body')}</p>
      </section>

      <section className={styles.section}>
        <h2 className={`text-h3 ${styles.sectionTitle}`}>{t('terms_changes_title')}</h2>
        <p className={`text-body-md ${styles.bodyText}`}>{t('terms_changes_body')}</p>
      </section>

      <p className={styles.updated}>{t('terms_updated')}</p>
    </div>
  )
}
