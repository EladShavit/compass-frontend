import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import styles from './ProGate.module.css'

export default function ProGate({ children, featureKey = 'progate_default_feature' }) {
  const { t } = useLanguage()
  return (
    <div className={styles.wrapper}>
      <div className={styles.blur} aria-hidden="true">
        {children}
      </div>
      <div className={styles.overlay}>
        <span className={`material-symbols-outlined ${styles.icon}`}>lock</span>
        <h3 className={`text-h3 ${styles.title}`}>{t(featureKey)}</h3>
        <p className={`text-body-md ${styles.subtitle}`}>
          {t('progate_subtitle')}
        </p>
        <Link to="/upgrade" className={styles.cta}>
          <span className="material-symbols-outlined">workspace_premium</span>
          {t('progate_cta')}
        </Link>
      </div>
    </div>
  )
}
