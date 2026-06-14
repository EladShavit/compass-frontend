import { useState, useRef, useEffect } from 'react'
import Avatar from '../../Avatar/Avatar'
import { auth } from '../../../lib/auth'
import { useAuth } from '../../../context/AuthContext'
import styles from './UserAvatar.module.css'

const MENU_ITEMS = [
  { icon: 'person', label: 'Profile' },
  { icon: 'settings', label: 'Settings' },
  { icon: 'help', label: 'Help & Support' },
  { divider: true },
  { icon: 'logout', label: 'Sign out' },
]

export default function UserAvatar({ src }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const { profile, user } = useAuth()

  const name = profile?.display_name || user?.email || 'User'
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  useEffect(() => {
    function handle(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  return (
    <div className={styles.wrapper} ref={ref}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="User menu"
      >
        <Avatar src={src || profile?.avatar_url} initials={initials} alt={name} size="md" />
        <span className={`material-symbols-outlined ${styles.chevron} ${open ? styles.open : ''}`}>
          expand_more
        </span>
      </button>

      {open && (
        <div className={styles.menu} role="menu">
          <div className={styles.menuHeader}>
            <Avatar src={src || profile?.avatar_url} initials={initials} alt={name} size="lg" />
            <div>
              <p className={styles.menuName}>{name}</p>
              <p className={styles.menuRole}>{profile?.tier === 'Pro' ? 'Pro Member' : 'Free Tier'}</p>
            </div>
          </div>
          <div className={styles.divider} />
          {MENU_ITEMS.map((item, i) =>
            item.divider ? (
              <div key={i} className={styles.divider} />
            ) : (
              <button 
                key={item.label} 
                type="button" 
                className={styles.menuItem} 
                role="menuitem"
                onClick={item.label === 'Sign out' ? async () => {
                  await auth.signOut()
                  // The ProtectedRoute listener will automatically handle the redirect to /login
                } : undefined}
              >
                <span className={`material-symbols-outlined ${styles.menuIcon}`}>{item.icon}</span>
                {item.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  )
}
