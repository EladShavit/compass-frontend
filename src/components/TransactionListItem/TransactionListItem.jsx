import Tag from '../Tag/Tag'
import { useLanguage } from '../../context/LanguageContext'
import styles from './TransactionListItem.module.css'

const STATUS_CONFIG = {
  completed: { labelKey: 'tx_status_completed', color: 'neutral' },
  pending:   { labelKey: 'tx_status_pending',   color: 'tertiary' },
  failed:    { labelKey: 'tx_status_failed',    color: 'error' },
}

export default function TransactionListItem({
  icon = 'payments',
  iconColor = 'default',
  name,
  category,
  date,
  status = 'completed',
  amount,
  positive = false,
  last = false,
}) {
  const { t } = useLanguage()
  const { labelKey, color } = STATUS_CONFIG[status] ?? STATUS_CONFIG.completed
  const label = t(labelKey)

  return (
    <tr className={`${styles.row} ${last ? styles.last : ''}`}>
      {/* Merchant cell */}
      <td className={styles.merchantCell}>
        <div className={`${styles.iconWrap} ${styles[`ic-${iconColor}`]}`}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <div>
          <p className={styles.name} dir="auto">{name}</p>
          <p className={styles.category}>{category}</p>
        </div>
      </td>

      {/* Date */}
      <td className={styles.dateCell}>{date}</td>

      {/* Status */}
      <td className={styles.statusCell}>
        <Tag color={color}>{label}</Tag>
      </td>

      {/* Amount */}
      <td className={`${styles.amountCell} ${positive ? styles.positive : ''} tabular-nums`}>
        {amount}
      </td>
    </tr>
  )
}
