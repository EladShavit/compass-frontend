import Tag from '../Tag/Tag'
import styles from './TransactionListItem.module.css'

const STATUS_CONFIG = {
  completed: { label: 'Completed', color: 'neutral' },
  pending:   { label: 'Pending',   color: 'tertiary' },
  failed:    { label: 'Failed',    color: 'error' },
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
  const { label, color } = STATUS_CONFIG[status] ?? STATUS_CONFIG.completed

  return (
    <tr className={`${styles.row} ${last ? styles.last : ''}`}>
      {/* Merchant cell */}
      <td className={styles.merchantCell}>
        <div className={`${styles.iconWrap} ${styles[`ic-${iconColor}`]}`}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <div>
          <p className={styles.name}>{name}</p>
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
