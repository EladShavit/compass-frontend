import TransactionListItem from '../TransactionListItem/TransactionListItem'
import { useCurrency } from '../../context/CurrencyContext'
import { useLanguage } from '../../context/LanguageContext'
import styles from './RecentTransactionsSection.module.css'

export default function RecentTransactionsSection({ transactions = [] }) {
  const { formatAmount } = useCurrency()
  const { t, tCat, language } = useLanguage()
  const formatCurrency = (amount, currency) => formatAmount(amount, currency)

  const formatDate = (dateStr) => {
    const locale = language === 'he' ? 'he-IL' : 'en-US'
    return new Date(dateStr).toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <section className={styles.wrapper} aria-label="Recent Transactions">
      {/* Header */}
      <div className={styles.header}>
        <h3 className={`text-h3 ${styles.title}`}>{t('recent_tx_title')}</h3>
        <div className={styles.actions}>
          <button className={styles.iconBtn} type="button" aria-label={t('recent_tx_filter')}>
            <span className="material-symbols-outlined">filter_list</span>
          </button>
          <button className={styles.iconBtn} type="button" aria-label={t('recent_tx_more_options')}>
            <span className="material-symbols-outlined">more_horiz</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.headRow}>
              <th className={`${styles.th} ${styles.thFirst}`}>{t('recent_tx_col_transaction')}</th>
              <th className={styles.th}>{t('recent_tx_col_date')}</th>
              <th className={styles.th}>{t('recent_tx_col_status')}</th>
              <th className={`${styles.th} ${styles.thLast}`}>{t('recent_tx_col_amount')}</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: 'var(--space-xl)', color: 'var(--color-on-surface-variant)' }}>
                  {t('recent_tx_none')}
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
                    category={tCat(tx.categories?.name || 'Uncategorized')}
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
