import { useState, useMemo } from 'react'
import { useAlerts } from '../../hooks/useAlerts'
import { useTransactions } from '../../hooks/useTransactions'
import { generateAlerts } from '../../lib/alertGenerator'
import AlertStatsSection from '../../components/AlertStatsSection/AlertStatsSection'
import AlertsFilterBarSection from '../../components/AlertsFilterBarSection/AlertsFilterBarSection'
import AlertsListSection from '../../components/AlertsListSection/AlertsListSection'
import PaginationSection from '../../components/PaginationSection/PaginationSection'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import { useLanguage } from '../../context/LanguageContext'
import styles from './AlertsPage.module.css'

export default function AlertsPage() {
  const { t } = useLanguage()
  const [activeFilter, setActiveFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [dismissed, setDismissed] = useState(new Set())

  const { alerts: dbAlerts, loading: alertsLoading, dismissAlert: dbDismiss } = useAlerts(null)
  const { transactions, loading: txLoading } = useTransactions(500)

  const loading = alertsLoading || txLoading

  // Merge DB alerts with client-generated alerts, remove dismissed
  const alerts = useMemo(() => {
    const generated = generateAlerts(transactions)
    return [...dbAlerts, ...generated].filter(a => !dismissed.has(a.alert_id))
  }, [dbAlerts, transactions, dismissed])

  function dismissAlert(id) {
    setDismissed(prev => new Set([...prev, id]))
    dbDismiss(id) // no-op for generated alerts (no DB row)
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {/* Page Header */}
        <header className={styles.header}>
          <div className={styles.headerText}>
            <h2 className="text-h1">{t('alerts_page_title')}</h2>
            <p className={styles.subtitle}>
              {t('alerts_page_subtitle')}
            </p>
          </div>
          <div className={styles.statusPill}>
            <span className={styles.statusDot} aria-hidden="true" />
            {t('alerts_system_status')} <span className={styles.statusStrong}>{t('alerts_status_optimal')}</span>
          </div>
        </header>

        {/* Stats Bento Grid */}
        <AlertStatsSection alerts={alerts} />

        {/* Filters & List Section */}
        <section className={styles.listSection}>
          <AlertsFilterBarSection
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
          <AlertsListSection 
            activeFilter={activeFilter} 
            alerts={alerts}
            onDismiss={dismissAlert}
          />
        </section>

        {/* Pagination */}
        <PaginationSection
          currentPage={currentPage}
          totalPages={Math.max(1, Math.ceil(alerts.length / 10))}
          onPageChange={setCurrentPage}
        />
      </main>
    </div>
  )
}
