import { NavLink } from 'react-router-dom'
import styles from './NavMenu.module.css'

const NAV_ITEMS = [
  { label: 'Dashboard',    to: '/dashboard',    icon: 'dashboard' },
  { label: 'Transactions', to: '/transactions', icon: 'receipt_long' },
  { label: 'Alerts',       to: '/alerts',       icon: 'notifications' },
  { label: 'Files',        to: '/files',        icon: 'folder' },
  { label: 'Insights',     to: '/insights',     icon: 'insights' },
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
