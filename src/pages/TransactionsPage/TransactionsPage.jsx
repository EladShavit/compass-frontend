import { useState, useCallback } from 'react'
import { useTransactions } from '../../hooks/useTransactions'
import RecentTransactionsSection from '../../components/RecentTransactionsSection/RecentTransactionsSection'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import Input from '../../components/Input/Input'
import ManualEntryForm from '../../components/ManualEntryForm/ManualEntryForm'
import { useLanguage } from '../../context/LanguageContext'
import styles from './TransactionsPage.module.css'

export default function TransactionsPage() {
  const { t } = useLanguage()
  const { transactions, loading, error, refetch } = useTransactions(200)
  const [search, setSearch] = useState('')
  const [directionFilter, setDirectionFilter] = useState('all')
  const [showManual, setShowManual] = useState(false)

  const filtered = transactions.filter((tx) => {
    const name = (tx.merchants?.name || tx.description || '').toLowerCase()
    const category = (tx.categories?.name || '').toLowerCase()
    const matchesSearch = name.includes(search.toLowerCase()) || category.includes(search.toLowerCase())
    const matchesDirection = directionFilter === 'all' || tx.direction === directionFilter
    return matchesSearch && matchesDirection
  })

  const handleSaved = useCallback(() => {
    refetch()
  }, [refetch])

  if (loading) return <LoadingSpinner />

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className="text-h1">{t('tx_page_title')}</h1>
          <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>
            {transactions.length} {t('tx_page_total')}
          </p>
        </div>
        <button
          type="button"
          className={styles.addBtn}
          onClick={() => setShowManual(true)}
        >
          <span className="material-symbols-outlined">add</span>
          {t('tx_add_btn')}
        </button>
      </header>

      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <Input
            type="search"
            placeholder={t('tx_search_placeholder')}
            icon="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.filters}>
          {['all', 'debit', 'credit'].map((d) => (
            <button
              key={d}
              type="button"
              className={`${styles.chip} ${directionFilter === d ? styles.chipActive : ''}`}
              onClick={() => setDirectionFilter(d)}
            >
              {d === 'all' ? t('tx_filter_all') : d === 'debit' ? t('tx_filter_expenses') : t('tx_filter_income')}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className={styles.error}>{t('tx_load_failed')}: {error}</p>
      )}

      <div className={styles.tableWrap}>
        <RecentTransactionsSection transactions={filtered} hideMore />
        {filtered.length === 0 && !loading && (
          <p className={styles.empty}>{t('tx_no_match')}</p>
        )}
      </div>

      <ManualEntryForm
        open={showManual}
        onClose={() => setShowManual(false)}
        onSaved={handleSaved}
      />
    </div>
  )
}
