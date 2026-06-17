import { useState, useMemo, useEffect } from 'react'
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
  const [sortOrder, setSortOrder] = useState('priority')
  const [currentPage, setCurrentPage] = useState(1)
  // Persist dismissed generated-alert IDs in localStorage so they survive navigation
  const [dismissed, setDismissed] = useState(() => {
    try {
      const saved = localStorage.getItem('compass_dismissed_alerts')
      return new Set(saved ? JSON.parse(saved) : [])
    } catch { return new Set() }
  })

  useEffect(() => {
    try {
      localStorage.setItem('compass_dismissed_alerts', JSON.stringify([...dismissed]))
    } catch {}
  }, [dismissed])

  const { alerts: dbAlerts, loading: alertsLoading, dismissAlert: dbDismiss } = useAlerts(null)
  const { transactions, loading: txLoading } = useTransactions(500)

  const loading = alertsLoading || txLoading

  // Generate client alerts only when transactions change (stable IDs across re-renders)
  const generated = useMemo(() => generateAlerts(transactions), [transactions])

  const SEVERITY_RANK = { critical: 0, warning: 1, opportunity: 2 }

  // Merge, filter dismissed, and sort
  const alerts = useMemo(() => {
    const merged = [...dbAlerts, ...generated].filter(a => !dismissed.has(a.alert_id))
    if (sortOrder === 'priority') {
      return [...merged].sort((a, b) => {
        const ra = SEVERITY_RANK[a.alert_categories?.default_severity?.toLowerCase()] ?? 3
        const rb = SEVERITY_RANK[b.alert_categories?.default_severity?.toLowerCase()] ?? 3
        return ra - rb
      })
    }
    if (sortOrder === 'oldest') {
      return [...merged].sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    }
    // newest (default from DB order)
    return [...merged].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  }, [dbAlerts, generated, dismissed, sortOrder])

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
            sortOrder={sortOrder}
            onSortChange={setSortOrder}
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
