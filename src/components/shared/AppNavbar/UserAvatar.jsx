import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Avatar from '../../Avatar/Avatar'
import { auth } from '../../../lib/auth'
import { useAuth } from '../../../context/AuthContext'
import { useLanguage } from '../../../context/LanguageContext'
import styles from './UserAvatar.module.css'

export default function UserAvatar({ src }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const { profile, user } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()

  const MENU_ITEMS = [
    { icon: 'person', key: 'usermenu_profile', to: '/profile' },
    { icon: 'settings', key: 'usermenu_settings', to: '/settings' },
    { icon: 'help', key: 'usermenu_help', to: '/contact' },
    { divider: true },
    { icon: 'logout', key: 'usermenu_signout' },
  ]

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
        aria-label={t('usermenu_aria')}
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
              <p className={styles.menuRole}>{profile?.tier === 'Pro' ? t('usermenu_pro') : t('usermenu_free')}</p>
            </div>
          </div>
          <div className={styles.divider} />
          {MENU_ITEMS.map((item, i) =>
            item.divider ? (
              <div key={i} className={styles.divider} />
            ) : (
              <button
                key={item.key}
                type="button"
                className={styles.menuItem}
                role="menuitem"
                onClick={item.key === 'usermenu_signout' ? async () => {
                  await auth.signOut()
                  navigate('/')
                } : item.to ? () => { setOpen(false); navigate(item.to) } : undefined}
              >
                <span className={`material-symbols-outlined ${styles.menuIcon}`}>{item.icon}</span>
                {t(item.key)}
              </button>
            )
          )}
        </div>
      )}
    </div>
  )
}
