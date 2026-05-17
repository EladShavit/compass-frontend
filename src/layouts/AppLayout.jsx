import { Outlet } from 'react-router-dom'
import AppNavbar from '../components/shared/AppNavbar/AppNavbar'
import Footer from '../components/shared/Footer/Footer'

export default function AppLayout() {
  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-background)' }}>
      <AppNavbar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}
