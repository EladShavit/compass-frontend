import { NavLink } from 'react-router-dom'
import styles from './NavMenu.module.css'

const NAV_ITEMS = [
  { label: 'Dashboard',        to: '/dashboard', icon: 'dashboard' },
  { label: 'Alerts Center',    to: '/alerts',    icon: 'warning' },
  { label: 'Statements',       to: '/upload',    icon: 'upload_file' },
  { label: 'Portfolio',        to: '/portfolio', icon: 'account_balance_wallet' },
  { label: 'Account Settings', to: '/settings',  icon: 'settings' },
]

export default function NavMenu() {
  return (
    <nav className={styles.menu} aria-label="Main navigation">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `${styles.item} ${isActive ? styles.active : ''}`
          }
        >
          <span className={`material-symbols-outlined ${styles.itemIcon}`}>{item.icon}</span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
