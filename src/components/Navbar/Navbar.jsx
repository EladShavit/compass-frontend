import Logo from './Logo'
import NavMenu from './NavMenu'
import NotificationBell from './NotificationBell'
import UserAvatar from './UserAvatar'
import styles from './Navbar.module.css'

export default function Navbar({ notificationCount = 3 }) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Logo />
        <NavMenu />
        <div className={styles.actions}>
          <NotificationBell count={notificationCount} />
          <UserAvatar />
        </div>
      </div>
    </header>
  )
}
