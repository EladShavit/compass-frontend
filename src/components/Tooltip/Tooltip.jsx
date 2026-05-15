import { useState } from 'react'
import styles from './Tooltip.module.css'

/**
 * Tooltip — wraps children and shows a tooltip on hover
 * positions: 'top' | 'bottom' | 'left' | 'right'
 */
export default function Tooltip({ children, text, position = 'top', className = '' }) {
  const [visible, setVisible] = useState(false)

  return (
    <div
      className={`${styles.wrapper} ${className}`}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className={`${styles.tooltip} ${styles[position]}`} role="tooltip">
          {text}
        </div>
      )}
    </div>
  )
}
