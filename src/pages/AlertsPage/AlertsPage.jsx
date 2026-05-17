import { useState } from 'react'
import AlertStatsSection from '../../components/AlertStatsSection/AlertStatsSection'
import AlertsFilterBarSection from '../../components/AlertsFilterBarSection/AlertsFilterBarSection'
import AlertsListSection from '../../components/AlertsListSection/AlertsListSection'
import PaginationSection from '../../components/PaginationSection/PaginationSection'
import styles from './AlertsPage.module.css'

export default function AlertsPage() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

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
        <AlertStatsSection />

        {/* Filters & List Section */}
        <section className={styles.listSection}>
          <AlertsFilterBarSection
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
          <AlertsListSection activeFilter={activeFilter} />
        </section>

        {/* Pagination */}
        <PaginationSection
          currentPage={currentPage}
          totalPages={3}
          onPageChange={setCurrentPage}
        />
      </main>
    </div>
  )
}
