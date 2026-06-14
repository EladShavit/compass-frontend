import TransactionListItem from '../TransactionListItem/TransactionListItem'
import styles from './RecentTransactionsSection.module.css'

export default function RecentTransactionsSection({ transactions = [] }) {
  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

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
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: 'var(--space-xl)', color: 'var(--color-on-surface-variant)' }}>
                  No recent transactions
                </td>
              </tr>
            ) : (
              transactions.map((tx, i) => {
                const isCredit = tx.direction === 'credit'
                const amountFormatted = `${isCredit ? '+' : '-'}${formatCurrency(tx.amount, tx.accounts?.currency)}`

                return (
                  <TransactionListItem
                    key={tx.transaction_id}
                    icon={tx.categories?.icon || 'receipt_long'}
                    iconColor={isCredit ? 'secondary' : 'default'}
                    name={tx.merchants?.name || tx.description || 'Unknown'}
                    category={tx.categories?.name || 'Uncategorized'}
                    date={formatDate(tx.date)}
                    status={tx.status.toLowerCase()}
                    amount={amountFormatted}
                    positive={isCredit}
                    last={i === transactions.length - 1}
                  />
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
