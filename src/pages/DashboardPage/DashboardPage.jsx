import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useAlerts } from '../../hooks/useAlerts'
import { useAccounts } from '../../hooks/useAccounts'
import { useTransactions } from '../../hooks/useTransactions'
import { useChartData } from '../../hooks/useChartData'
import { useLanguage } from '../../context/LanguageContext'
import WelcomeHeaderSection from '../../components/WelcomeHeaderSection/WelcomeHeaderSection'
import AlertsBannerSection from '../../components/AlertsBannerSection/AlertsBannerSection'
import KPIStatsSection from '../../components/KPIStatsSection/KPIStatsSection'
import ChartsRowSection from '../../components/ChartsRowSection/ChartsRowSection'
import RecentTransactionsSection from '../../components/RecentTransactionsSection/RecentTransactionsSection'
import { KPICardSkeleton } from '../../components/Skeleton/Skeleton'
import kpiStyles from '../../components/KPIStatsSection/KPIStatsSection.module.css'
import styles from './DashboardPage.module.css'

export default function DashboardPage() {
  const { profile, user } = useAuth()
  const { t } = useLanguage()
  const { alerts, loading: loadingAlerts, dismissAlert } = useAlerts('New')
  const { accounts, loading: loadingAccounts } = useAccounts()
  const { transactions: recentTransactions, loading: loadingTransactions } = useTransactions(5)
  const { transactions: allTransactions } = useTransactions(500)
  const { chartData, loading: loadingChart } = useChartData()

  const firstName = profile?.first_name || profile?.display_name?.split(' ')[0] || user?.email?.split('@')[0] || 'User'

  const kpiLoading = loadingAccounts || loadingTransactions
  const pageLoading = loadingAlerts || loadingChart

  // Format alerts for the banner
  const formattedAlerts = alerts.map(a => ({
    id: a.alert_id,
    type: a.alert_categories?.default_severity?.toLowerCase() === 'critical' ? 'error' 
        : a.alert_categories?.default_severity?.toLowerCase() === 'warning' ? 'warning' 
        : 'info',
    icon: a.alert_categories?.default_severity?.toLowerCase() === 'critical' ? 'error'
        : a.alert_categories?.default_severity?.toLowerCase() === 'warning' ? 'warning'
        : 'info',
    message: a.title,
  }))

  const hasData = !loadingAccounts && accounts.length === 0 && !loadingTransactions && allTransactions.length === 0

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <WelcomeHeaderSection name={firstName} updatedAt={new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} />

        <AlertsBannerSection alerts={formattedAlerts} onDismiss={dismissAlert} />

        {kpiLoading ? (
          <section className={kpiStyles.grid} aria-label="Loading">
            <div className={kpiStyles.wide}><KPICardSkeleton wide /></div>
            <KPICardSkeleton />
            <KPICardSkeleton />
          </section>
        ) : (
          <KPIStatsSection accounts={accounts} transactions={allTransactions} />
        )}

        {hasData ? (
          <div className={styles.emptyState}>
            <span className="material-symbols-outlined" style={{ fontSize: 56, color: 'var(--color-primary)' }}>
              upload_file
            </span>
            <h2 className="text-h2">{t('dashboard_empty_title')}</h2>
            <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)', maxWidth: 380, textAlign: 'center' }}>
              {t('dashboard_empty_desc')}
            </p>
            <Link to="/upload" className={styles.emptyBtn}>{t('dashboard_empty_cta')}</Link>
          </div>
        ) : (
          <>
            <ChartsRowSection chartData={chartData} />
            <RecentTransactionsSection transactions={recentTransactions} />
          </>
        )}
      </main>
    </div>
  )
}
