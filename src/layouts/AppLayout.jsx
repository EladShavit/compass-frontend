import { Link, Outlet } from 'react-router-dom'
import { useTier } from '../hooks/useTier'
import { useLanguage } from '../context/LanguageContext'
import AppNavbar from '../components/shared/AppNavbar/AppNavbar'
import Footer from '../components/shared/Footer/Footer'
import ChatWidget from '../components/ChatWidget/ChatWidget'

function TrialBanner() {
  const { isTrialing, trialDaysLeft } = useTier()
  const { language } = useLanguage()

  if (!isTrialing) return null

  const message = language === 'he'
    ? `נותרו לך ${trialDaysLeft} יום${trialDaysLeft === 1 ? '' : 'ים'} בתקופת הניסיון החינמית.`
    : `You have ${trialDaysLeft} day${trialDaysLeft === 1 ? '' : 's'} left in your free trial.`
  const cta = language === 'he' ? 'שדרגו ל-Pro' : 'Upgrade to Pro'

  return (
    <div style={{
      background: 'var(--color-secondary)',
      color: 'var(--color-on-secondary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      padding: '8px 16px',
      fontSize: '0.85rem',
      fontWeight: 500,
    }}>
      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>workspace_premium</span>
      <span>{message}</span>
      <Link to="/upgrade" style={{
        color: 'var(--color-on-secondary)',
        fontWeight: 700,
        textDecoration: 'underline',
        whiteSpace: 'nowrap',
      }}>{cta} →</Link>
    </div>
  )
}

export default function AppLayout() {
  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-background)' }}>
      <AppNavbar />
      <TrialBanner />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </div>
      <Footer />
      <ChatWidget />
    </div>
  )
}
