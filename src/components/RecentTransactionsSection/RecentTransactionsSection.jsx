import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TransactionListItem from '../TransactionListItem/TransactionListItem'
import { useCurrency } from '../../context/CurrencyContext'
import { useLanguage } from '../../context/LanguageContext'
import styles from './RecentTransactionsSection.module.css'

export default function RecentTransactionsSection({ transactions = [], onAddTransaction, hideMore = false }) {
  const { formatAmount } = useCurrency()
  const { t, tCat, language } = useLanguage()
  const navigate = useNavigate()

  const [dirFilter, setDirFilter] = useState('all')
  const [filterOpen, setFilterOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const filterRef = useRef(null)
  const moreRef = useRef(null)

  // Close dropdowns on outside click
  useEffect(() => {
    function handler(e) {
      if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false)
      if (moreRef.current && !moreRef.current.contains(e.target)) setMoreOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const formatDate = (dateStr) => {
    const locale = language === 'he' ? 'he-IL' : 'en-US'
    return new Date(dateStr).toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const displayed = dirFilter === 'all'
    ? transactions
    : transactions.filter(tx => tx.direction === dirFilter)

  const FILTER_OPTIONS = [
    { value: 'all',    label: t('tx_filter_all') },
    { value: 'debit',  label: t('tx_filter_expenses') },
    { value: 'credit', label: t('tx_filter_income') },
  ]

  return (
    <section className={styles.wrapper} aria-label="Recent Transactions">
      {/* Header */}
      <div className={styles.header}>
        <h3 className={`text-h3 ${styles.title}`}>{t('recent_tx_title')}</h3>
        <div className={styles.actions}>
          {/* Filter dropdown */}
          <div className={styles.dropdownWrap} ref={filterRef}>
            <button
              className={`${styles.iconBtn} ${filterOpen || dirFilter !== 'all' ? styles.iconBtnActive : ''}`}
              type="button"
              aria-label={t('recent_tx_filter')}
              onClick={() => { setFilterOpen(o => !o); setMoreOpen(false) }}
            >
              <span className="material-symbols-outlined">filter_list</span>
              {dirFilter !== 'all' && <span className={styles.filterDot} />}
            </button>
            {filterOpen && (
              <div className={styles.dropdown}>
                {FILTER_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`${styles.dropdownItem} ${dirFilter === opt.value ? styles.dropdownItemActive : ''}`}
                    onClick={() => { setDirFilter(opt.value); setFilterOpen(false) }}
                  >
                    {dirFilter === opt.value && <span className="material-symbols-outlined" style={{ fontSize: 16 }}>check</span>}
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* More options dropdown — hidden when already on transactions page */}
          {!hideMore && (
            <div className={styles.dropdownWrap} ref={moreRef}>
              <button
                className={`${styles.iconBtn} ${moreOpen ? styles.iconBtnActive : ''}`}
                type="button"
                aria-label={t('recent_tx_more_options')}
                onClick={() => { setMoreOpen(o => !o); setFilterOpen(false) }}
              >
                <span className="material-symbols-outlined">more_horiz</span>
              </button>
              {moreOpen && (
                <div className={styles.dropdown}>
                  <button
                    type="button"
                    className={styles.dropdownItem}
                    onClick={() => { navigate('/transactions'); setMoreOpen(false) }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>open_in_full</span>
                    {t('recent_tx_view_all')}
                  </button>
                  {onAddTransaction && (
                    <button
                      type="button"
                      className={styles.dropdownItem}
                      onClick={() => { onAddTransaction(); setMoreOpen(false) }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
                      {t('tx_add_btn')}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
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
            {displayed.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: 'var(--space-xl)', color: 'var(--color-on-surface-variant)' }}>
                  {t('recent_tx_none')}
                </td>
              </tr>
            ) : (
              displayed.map((tx, i) => {
                const isCredit = tx.direction === 'credit'
                const amountFormatted = `${isCredit ? '+' : '-'}${formatAmount(tx.amount, tx.accounts?.currency)}`
                return (
                  <TransactionListItem
                    key={tx.transaction_id}
                    icon={tx.categories?.icon || 'receipt_long'}
                    iconColor={isCredit ? 'secondary' : 'default'}
                    name={tx.merchants?.name || tx.description || 'Unknown'}
                    category={tCat(tx.categories?.name || 'Uncategorized')}
                    date={formatDate(tx.date)}
                    status={tx.status?.toLowerCase()}
                    amount={amountFormatted}
                    positive={isCredit}
                    last={i === displayed.length - 1}
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
