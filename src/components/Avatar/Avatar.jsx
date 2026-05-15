import styles from './Avatar.module.css'

/**
 * Avatar — displays user image or initials fallback
 * sizes: 'sm' | 'md' | 'lg'
 */
export default function Avatar({ src, alt = '', initials = '', size = 'md', className = '' }) {
  return (
    <div className={`${styles.avatar} ${styles[size]} ${className}`} aria-label={alt}>
      {src ? (
        <img src={src} alt={alt} className={styles.img} />
      ) : (
        <span className={styles.initials}>{initials}</span>
      )}
    </div>
  )
}
