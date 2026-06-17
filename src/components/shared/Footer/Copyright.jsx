import { useLanguage } from '../../../context/LanguageContext'
import styles from './Copyright.module.css'

export default function Copyright() {
  const { t } = useLanguage()
  const year = new Date().getFullYear()
  return (
    <p className={styles.text}>
      © {year} Compass. {t('footer_copyright')}
    </p>
  )
}
