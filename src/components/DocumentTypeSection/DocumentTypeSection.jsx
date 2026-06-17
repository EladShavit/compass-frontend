import DocTypeCard from '../DocTypeCard/DocTypeCard'
import { useLanguage } from '../../context/LanguageContext'
import styles from './DocumentTypeSection.module.css'

export default function DocumentTypeSection({ value, onChange }) {
  const { t } = useLanguage()

  const DOC_TYPES = [
    { id: 'bank',    icon: 'account_balance', title: t('doc_type_bank_title'),    description: t('doc_type_bank_desc') },
    { id: 'tax',     icon: 'request_quote',   title: t('doc_type_tax_title'),     description: t('doc_type_tax_desc') },
    { id: 'invoice', icon: 'receipt_long',    title: t('doc_type_invoice_title'), description: t('doc_type_invoice_desc') },
    { id: 'other',   icon: 'folder_open',     title: t('doc_type_other_title'),   description: t('doc_type_other_desc') },
  ]

  return (
    <div className={styles.wrapper}>
      <label className={`text-label-caps ${styles.sectionLabel}`}>
        {t('upload_doc_type_label')}
      </label>
      <div className={styles.grid}>
        {DOC_TYPES.map((dt) => (
          <DocTypeCard
            key={dt.id}
            icon={dt.icon}
            title={dt.title}
            description={dt.description}
            active={value === dt.id}
            onClick={() => onChange(dt.id)}
          />
        ))}
      </div>
    </div>
  )
}
