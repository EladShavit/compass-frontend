import TransactionListItem from '../TransactionListItem/TransactionListItem'
import styles from './RecentTransactionsSection.module.css'

const TRANSACTIONS = [
  {
    id: 1,
    icon: 'storefront',
    iconColor: 'default',
    name: 'Apple Store',
    category: 'Electronics',
    date: 'Oct 24, 2024',
    status: 'completed',
    amount: '-$1,299.00',
    positive: false,
  },
  {
    id: 2,
    icon: 'flight',
    iconColor: 'default',
    name: 'Delta Airlines',
    category: 'Travel',
    date: 'Oct 22, 2024',
    status: 'pending',
    amount: '-$450.00',
    positive: false,
  },
  {
    id: 3,
    icon: 'payments',
    iconColor: 'secondary',
    name: 'Tech Corp Inc.',
    category: 'Payroll',
    date: 'Oct 15, 2024',
    status: 'completed',
    amount: '+$8,500.00',
    positive: true,
  },
]

export default function RecentTransactionsSection() {
  return (
    <section className={styles.wrapper} aria-label="Recent Transactions">
      {/* Header */}
      <div className={styles.header}>
        <h3 className={`text-h3 ${styles.title}`}>Recent Transactions</h3>
        <div className={styles.actions}>
          <button className={styles.iconBtn} type="button" aria-label="Filter">
            <span className="material-symbols-outlined">filter_list</span>
          </button>
          <button className={styles.iconBtn} type="button" aria-label="More options">
            <span className="material-symbols-outlined">more_horiz</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.headRow}>
              <th className={`${styles.th} ${styles.thFirst}`}>Transaction</th>
              <th className={styles.th}>Date</th>
              <th className={styles.th}>Status</th>
              <th className={`${styles.th} ${styles.thLast}`}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {TRANSACTIONS.map((tx, i) => (
              <TransactionListItem
                key={tx.id}
                {...tx}
                last={i === TRANSACTIONS.length - 1}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
