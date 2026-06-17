import { Link, NavLink } from 'react-router-dom'
import Logo from '../AppNavbar/Logo'
import Button from '../../Button/Button'
import { useLanguage } from '../../../context/LanguageContext'
import styles from './PublicNavbar.module.css'

const NAV_ITEMS = [
  { key: 'nav_home',    to: '/' },
  { key: 'nav_about',   to: '/about' },
  { key: 'nav_pricing', to: '/pricing' },
]

export default function PublicNavbar() {
  const { t } = useLanguage()
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Logo />

        <nav className={styles.nav} aria-label="Public navigation">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ''}`
              }
            >
              {t(item.key)}
            </NavLink>
          ))}
        </nav>

        <div className={styles.actions}>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <Button variant="ghost">{t('nav_login')}</Button>
          </Link>
          <Link to="/register" style={{ textDecoration: 'none' }}>
            <Button variant="secondary">{t('nav_register')}</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
