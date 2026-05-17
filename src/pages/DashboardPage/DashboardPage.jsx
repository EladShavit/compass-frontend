import { useState } from 'react'
import WelcomeHeaderSection from '../../components/WelcomeHeaderSection/WelcomeHeaderSection'
import AlertsBannerSection from '../../components/AlertsBannerSection/AlertsBannerSection'
import KPIStatsSection from '../../components/KPIStatsSection/KPIStatsSection'
import ChartsRowSection from '../../components/ChartsRowSection/ChartsRowSection'
import RecentTransactionsSection from '../../components/RecentTransactionsSection/RecentTransactionsSection'
import styles from './DashboardPage.module.css'

const INITIAL_ALERTS = [
  {
    id: 1,
    type: 'warning',
    icon: 'warning',
    message: 'An unusual transaction of ₪3,200 from "Shopping Center" was detected. Please confirm if this is correct.',
  },
  {
    id: 2,
    type: 'info',
    icon: 'info',
    message: 'Your monthly report for October is ready to view.',
  },
]

export default function DashboardPage() {
  const [alerts, setAlerts] = useState(INITIAL_ALERTS)

  function dismissAlert(id) {
    setAlerts((prev) => prev.filter((a) => a.id !== id))
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <WelcomeHeaderSection name="Alex" updatedAt="Today, 09:41 AM" />

        <AlertsBannerSection alerts={alerts} onDismiss={dismissAlert} />

        <KPIStatsSection />

        <ChartsRowSection />

        <RecentTransactionsSection />
      </main>
    </div>
  )
}
