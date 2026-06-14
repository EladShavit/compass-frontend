import { useState } from 'react'
import { useAlerts } from '../../hooks/useAlerts'
import AlertStatsSection from '../../components/AlertStatsSection/AlertStatsSection'
import AlertsFilterBarSection from '../../components/AlertsFilterBarSection/AlertsFilterBarSection'
import AlertsListSection from '../../components/AlertsListSection/AlertsListSection'
import PaginationSection from '../../components/PaginationSection/PaginationSection'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import styles from './AlertsPage.module.css'

export default function AlertsPage() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  
  // Pass null to fetch all alerts regardless of status
  const { alerts, loading, dismissAlert } = useAlerts(null)

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
            <h2 className="text-h1">Alerts Center</h2>
            <p className={styles.subtitle}>
              Monitor and manage critical account notifications, optimization opportunities, and security events requiring your attention.
            </p>
          </div>
          <div className={styles.statusPill}>
            <span className={styles.statusDot} aria-hidden="true" />
            System Status: <span className={styles.statusStrong}>Optimal</span>
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
