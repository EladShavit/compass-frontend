import DocTypeCard from '../DocTypeCard/DocTypeCard'
import styles from './DocumentTypeSection.module.css'

const DOC_TYPES = [
  { id: 'bank',    icon: 'account_balance', title: 'Bank Statement', description: 'Monthly account summaries' },
  { id: 'tax',     icon: 'request_quote',   title: 'Tax Document',   description: 'W-2, 1099, or returns' },
  { id: 'invoice', icon: 'receipt_long',    title: 'Invoice',        description: 'Vendor or client bills' },
  { id: 'other',   icon: 'folder_open',     title: 'Other',          description: 'Contracts and notices' },
]

export default function DocumentTypeSection({ value, onChange }) {
  return (
    <div className={styles.wrapper}>
      <label className={`text-label-caps ${styles.sectionLabel}`}>
        1. Document Type
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
