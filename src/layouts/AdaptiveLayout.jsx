import { Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AppNavbar from '../components/shared/AppNavbar/AppNavbar'
import PublicNavbar from '../components/shared/PublicNavbar/PublicNavbar'
import Footer from '../components/shared/Footer/Footer'

export default function AdaptiveLayout() {
  const { user } = useAuth()
  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-background)' }}>
      {user ? <AppNavbar /> : <PublicNavbar />}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}
