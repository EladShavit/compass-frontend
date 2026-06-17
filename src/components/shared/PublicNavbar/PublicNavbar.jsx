import { useState, useEffect, useRef } from 'react'
import { Link, NavLink } from 'react-router-dom'
import Logo from '../AppNavbar/Logo'
import Button from '../../Button/Button'
import { useLanguage } from '../../../context/LanguageContext'
import styles from './PublicNavbar.module.css'

const NAV_ITEMS = [
  { key: 'nav_home',        to: '/' },
  { key: 'nav_about',       to: '/about' },
  { key: 'nav_pricing',     to: '/pricing' },
  { key: 'footer_contact',  to: '/contact' },
]

export default function PublicNavbar() {
  const { t } = useLanguage()
  const [mobileOpen, setMobileOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setMobileOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <header className={styles.header} ref={ref}>
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

        {/* Hamburger — mobile only */}
        <button
          type="button"
          className={styles.burger}
          aria-label="Open menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(o => !o)}
        >
          <span className={`material-symbols-outlined ${styles.burgerIcon}`}>
            {mobileOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className={styles.mobileMenu}>
          <nav className={styles.mobileNav}>
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `${styles.mobileNavItem} ${isActive ? styles.mobileNavActive : ''}`
                }
                onClick={() => setMobileOpen(false)}
              >
                {t(item.key)}
              </NavLink>
            ))}
          </nav>
          <div className={styles.mobileActions}>
            <Link to="/login" style={{ textDecoration: 'none' }} onClick={() => setMobileOpen(false)}>
              <Button variant="secondary" size="md" fullWidth>{t('nav_login')}</Button>
            </Link>
            <Link to="/register" style={{ textDecoration: 'none' }} onClick={() => setMobileOpen(false)}>
              <Button variant="primary" size="md" fullWidth>{t('nav_register')}</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
