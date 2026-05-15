import styles from './Checkbox.module.css'

/**
 * Checkbox — controlled checkbox with label
 */
export default function Checkbox({ id, label, checked, onChange, disabled = false, className = '' }) {
  return (
    <label className={`${styles.label} ${className}`} htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        className={styles.input}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <span className={styles.box} aria-hidden="true" />
      {label && <span className={styles.text}>{label}</span>}
    </label>
  )
}
