import styles from './IconBox.module.css'

/**
 * IconBox — icon in a styled container
 * colors: 'primary' | 'secondary' | 'tertiary' | 'neutral'
 * sizes:  'sm' | 'md' | 'lg'
 */
export default function IconBox({ icon, color = 'primary', size = 'md', className = '' }) {
  return (
    <div className={`${styles.box} ${styles[color]} ${styles[size]} ${className}`}>
      <span className="material-symbols-outlined">{icon}</span>
    </div>
  )
}
