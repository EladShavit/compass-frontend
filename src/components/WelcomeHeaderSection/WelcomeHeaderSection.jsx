import { useLanguage } from '../../context/LanguageContext'
import styles from './WelcomeHeaderSection.module.css'

export default function WelcomeHeaderSection({ name = 'Alex', updatedAt = 'Today, 09:41 AM' }) {
  const { t } = useLanguage()
  return (
    <div className={styles.wrapper}>
      <div>
        <h1 className={`text-h1 ${styles.heading}`}>{t('dashboard_welcome_back')}, {name}</h1>
        <p className={styles.sub}>{t('dashboard_summary')}</p>
      </div>
      <div className={styles.timestamp}>
        <p className={`text-label-caps ${styles.tsLabel}`}>{t('dashboard_last_updated')}</p>
        <p className={styles.tsValue}>{updatedAt}</p>
      </div>
    </div>
  )
}
