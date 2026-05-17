import { Link, NavLink } from 'react-router-dom'
import Logo from '../AppNavbar/Logo'
import Button from '../../Button/Button'
import styles from './PublicNavbar.module.css'

const NAV_ITEMS = [
  { label: 'Home',    to: '/' },
  { label: 'About',   to: '/about' },
  { label: 'Pricing', to: '/pricing' },
]

export default function PublicNavbar() {
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
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.actions}>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <Button variant="ghost">Login</Button>
          </Link>
          <Link to="/register" style={{ textDecoration: 'none' }}>
            <Button variant="secondary">Register</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
