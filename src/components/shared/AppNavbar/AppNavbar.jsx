import { useNavigate } from 'react-router-dom'
import Logo from './Logo'
import NavMenu from './NavMenu'
import NotificationBell from './NotificationBell'
import UserAvatar from './UserAvatar'
import { useAlerts } from '../../../hooks/useAlerts'
import styles from './AppNavbar.module.css'

export default function AppNavbar() {
  const navigate = useNavigate()
  const { alerts } = useAlerts()
  const unreadCount = alerts.filter((a) => !a.is_read).length

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Logo />
        <NavMenu />
        <div className={styles.actions}>
          <NotificationBell count={unreadCount} onClick={() => navigate('/alerts')} />
          <UserAvatar />
        </div>
      </div>
    </header>
  )
}
