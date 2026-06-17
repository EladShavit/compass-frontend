import { useAuth } from '../../context/AuthContext'
import { useAlerts } from '../../hooks/useAlerts'
import { useAccounts } from '../../hooks/useAccounts'
import { useTransactions } from '../../hooks/useTransactions'
import { useChartData } from '../../hooks/useChartData'
import WelcomeHeaderSection from '../../components/WelcomeHeaderSection/WelcomeHeaderSection'
import AlertsBannerSection from '../../components/AlertsBannerSection/AlertsBannerSection'
import KPIStatsSection from '../../components/KPIStatsSection/KPIStatsSection'
import ChartsRowSection from '../../components/ChartsRowSection/ChartsRowSection'
import RecentTransactionsSection from '../../components/RecentTransactionsSection/RecentTransactionsSection'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import styles from './DashboardPage.module.css'

export default function DashboardPage() {
  const { profile, user } = useAuth()
  const { alerts, loading: loadingAlerts, dismissAlert } = useAlerts('New')
  const { accounts, loading: loadingAccounts } = useAccounts()
  const { transactions: recentTransactions, loading: loadingTransactions } = useTransactions(5)
  const { transactions: allTransactions } = useTransactions(500)
  const { chartData, loading: loadingChart } = useChartData()

  // Use the profile first name, or display name, or fallback to User
  const firstName = profile?.first_name || profile?.display_name?.split(' ')[0] || user?.email?.split('@')[0] || 'User'

  const isLoading = loadingAlerts || loadingAccounts || loadingTransactions || loadingChart

  if (isLoading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner />
      </div>
    )
  }

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

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <WelcomeHeaderSection name={firstName} updatedAt={new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} />

        <AlertsBannerSection alerts={formattedAlerts} onDismiss={dismissAlert} />

        <KPIStatsSection accounts={accounts} transactions={allTransactions} />

        <ChartsRowSection chartData={chartData} />

        <RecentTransactionsSection transactions={recentTransactions} />
      </main>
    </div>
  )
}
