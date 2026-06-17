import styles from './NotificationBell.module.css'

export default function NotificationBell({ count = 0, onClick }) {
  return (
    <button className={styles.btn} aria-label={`Notifications${count ? `, ${count} unread` : ''}`} type="button" onClick={onClick}>
      <span className={`material-symbols-outlined ${styles.icon}`}>notifications</span>
      {count > 0 && (
        <span className={styles.badge}>{count > 99 ? '99+' : count}</span>
      )}
    </button>
  )
}
