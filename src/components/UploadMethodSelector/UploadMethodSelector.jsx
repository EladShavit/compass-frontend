import { useLanguage } from '../../context/LanguageContext'
import styles from './UploadMethodSelector.module.css'

const METHODS = [
  {
    key: 'pdf',
    icon: 'picture_as_pdf',
    titleKey: 'upload_method_pdf_title',
    descKey: 'upload_method_pdf_desc',
  },
  {
    key: 'csv',
    icon: 'table_chart',
    titleKey: 'upload_method_csv_title',
    descKey: 'upload_method_csv_desc',
  },
]

export default function UploadMethodSelector({ value, onChange }) {
  const { t } = useLanguage()
  return (
    <div className={styles.wrapper}>
      <p className={`text-label-caps ${styles.label}`}>{t('upload_method_label')}</p>
      <div className={styles.grid}>
        {METHODS.map((m) => (
          <button
            key={m.key}
            type="button"
            className={`${styles.card} ${value === m.key ? styles.cardActive : ''}`}
            onClick={() => onChange(m.key)}
          >
            <span className={`material-symbols-outlined ${styles.icon}`}>{m.icon}</span>
            <span className={styles.title}>{t(m.titleKey)}</span>
            <span className={styles.desc}>{t(m.descKey)}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
