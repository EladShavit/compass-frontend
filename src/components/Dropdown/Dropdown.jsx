import { useState, useRef, useEffect } from 'react'
import styles from './Dropdown.module.css'

/**
 * Dropdown — select-like dropdown with custom options
 * options: [{ value, label, icon? }]
 */
export default function Dropdown({ options = [], value, onChange, placeholder = 'Select…', className = '' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const selected = options.find((o) => o.value === value)

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={`${styles.wrapper} ${className}`} ref={ref}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{selected ? selected.label : placeholder}</span>
        <span className={`material-symbols-outlined ${styles.chevron} ${open ? styles.open : ''}`}>
          expand_more
        </span>
      </button>
      {open && (
        <ul className={styles.menu} role="listbox">
          {options.map((opt) => (
            <li
              key={opt.value}
              className={`${styles.option} ${opt.value === value ? styles.selected : ''}`}
              role="option"
              aria-selected={opt.value === value}
              onClick={() => {
                onChange?.(opt.value)
                setOpen(false)
              }}
            >
              {opt.icon && (
                <span className={`material-symbols-outlined ${styles.optIcon}`}>{opt.icon}</span>
              )}
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
