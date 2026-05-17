import { Outlet } from 'react-router-dom'
import PublicNavbar from '../components/shared/PublicNavbar/PublicNavbar'
import Footer from '../components/shared/Footer/Footer'

export default function PublicLayout() {
  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-background)' }}>
      <PublicNavbar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}
