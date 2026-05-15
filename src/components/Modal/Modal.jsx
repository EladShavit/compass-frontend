import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import styles from './Modal.module.css'

/**
 * Modal — global wrapper rendered in a portal
 */
export default function Modal({ open, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return createPortal(
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-label={title}>
      <div
        className={`${styles.panel} ${styles[size]}`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className={styles.header}>
            <h2 className={`text-h3 ${styles.title}`}>{title}</h2>
            <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        )}
        <div className={styles.body}>{children}</div>
      </div>
    </div>,
    document.body
  )
}
