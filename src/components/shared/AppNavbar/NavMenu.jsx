import { NavLink } from 'react-router-dom'
import { useLanguage } from '../../../context/LanguageContext'
import styles from './NavMenu.module.css'

const NAV_ITEMS = [
  { key: 'nav_dashboard', to: '/dashboard', icon: 'dashboard' },
  { key: 'nav_alerts',    to: '/alerts',    icon: 'warning' },
  { key: 'nav_statements', to: '/upload',   icon: 'upload_file' },
  { key: 'nav_insights',  to: '/insights',  icon: 'auto_awesome' },
  { key: 'nav_settings',  to: '/settings',  icon: 'settings' },
]

export default function NavMenu() {
  const { t } = useLanguage()
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
          <span>{t(item.key)}</span>
        </NavLink>
      ))}
    </nav>
  )
}
