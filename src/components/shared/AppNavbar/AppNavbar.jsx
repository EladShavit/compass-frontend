import { useState, useEffect, useRef } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import Logo from './Logo'
import NavMenu from './NavMenu'
import NotificationBell from './NotificationBell'
import UserAvatar from './UserAvatar'
import Avatar from '../../Avatar/Avatar'
import { useAlerts } from '../../../hooks/useAlerts'
import { useAuth } from '../../../context/AuthContext'
import { useLanguage } from '../../../context/LanguageContext'
import { useTier } from '../../../hooks/useTier'
import { auth } from '../../../lib/auth'
import styles from './AppNavbar.module.css'

const MOBILE_NAV_ITEMS = [
  { key: 'nav_dashboard',    to: '/dashboard',    icon: 'dashboard' },
  { key: 'nav_transactions', to: '/transactions', icon: 'receipt_long' },
  { key: 'nav_alerts',       to: '/alerts',       icon: 'warning' },
  { key: 'nav_statements',   to: '/upload',       icon: 'upload_file' },
  { key: 'nav_insights',     to: '/insights',     icon: 'auto_awesome' },
  { key: 'usermenu_profile',  to: '/profile',    icon: 'person' },
  { key: 'usermenu_settings', to: '/settings',   icon: 'settings' },
]

export default function AppNavbar() {
  const navigate = useNavigate()
  const { alerts } = useAlerts()
  const { profile, user } = useAuth()
  const { t } = useLanguage()
  const { isPro, isTrialing, trialDaysLeft } = useTier()
  const unreadCount = alerts.filter((a) => !a.is_read).length
  const [mobileOpen, setMobileOpen] = useState(false)
  const menuRef = useRef(null)

  // Close menu on outside click
  useEffect(() => {
    function handler(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMobileOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close menu on route change
  useEffect(() => { setMobileOpen(false) }, [navigate])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const name = profile?.display_name || user?.email || 'User'
  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()

  return (
    <header className={styles.header} ref={menuRef}>
      <div className={styles.inner}>
        <Logo />
        <NavMenu />
        <div className={styles.actions}>
          <NotificationBell count={unreadCount} alerts={alerts} />
          <UserAvatar />
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
          {/* User identity */}
          <div className={styles.mobileUser}>
            <Avatar src={profile?.avatar_url} initials={initials} alt={name} size="md" />
            <div>
              <div className={styles.mobileName}>{name}</div>
              <div className={styles.mobileTier}>
                {isTrialing
                  ? `${t('profile_tier_trial')} (${trialDaysLeft}d)`
                  : isPro ? t('usermenu_pro') : t('usermenu_free')}
              </div>
            </div>
            <NotificationBell count={unreadCount} alerts={alerts} />
          </div>

          {/* Nav links */}
          <nav className={styles.mobileNav}>
            {MOBILE_NAV_ITEMS.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `${styles.mobileNavItem} ${isActive ? styles.mobileNavActive : ''}`
                }
                onClick={() => setMobileOpen(false)}
              >
                <span className={`material-symbols-outlined ${styles.mobileNavIcon}`}>{item.icon}</span>
                {t(item.key)}
              </NavLink>
            ))}
          </nav>

          {/* Sign out */}
          <button
            type="button"
            className={styles.mobileSignOut}
            onClick={async () => { await auth.signOut(); navigate('/') }}
          >
            <span className="material-symbols-outlined">logout</span>
            {t('usermenu_signout')}
          </button>
        </div>
      )}
    </header>
  )
}
