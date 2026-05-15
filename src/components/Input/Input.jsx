import { useState, forwardRef } from 'react'
import styles from './Input.module.css'

/**
 * Input
 * types: 'text' | 'email' | 'password' | 'search'
 */
const Input = forwardRef(function Input(
  {
    type = 'text',
    id,
    name,
    label,
    placeholder,
    value,
    onChange,
    icon,
    required = false,
    error,
    helper,
    className = '',
    ...rest
  },
  ref
) {
  const [showPassword, setShowPassword] = useState(false)
  const resolvedType =
    type === 'password' ? (showPassword ? 'text' : 'password') : type

  return (
    <div className={`${styles.wrapper} ${className}`}>
      {label && (
        <label className={styles.label} htmlFor={id}>
          {label}
        </label>
      )}
      <div className={styles.inputWrapper}>
        {icon && (
          <span className={`material-symbols-outlined ${styles.leadingIcon}`}>
            {icon}
          </span>
        )}
        <input
          ref={ref}
          id={id}
          name={name}
          type={resolvedType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={[
            styles.input,
            icon ? styles.hasLeadingIcon : '',
            type === 'password' ? styles.hasTrailingIcon : '',
            error ? styles.inputError : '',
          ]
            .filter(Boolean)
            .join(' ')}
          {...rest}
        />
        {type === 'password' && (
          <button
            type="button"
            className={styles.trailingBtn}
            onClick={() => setShowPassword((p) => !p)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <span className="material-symbols-outlined">
              {showPassword ? 'visibility' : 'visibility_off'}
            </span>
          </button>
        )}
        {type === 'search' && (
          <span className={`material-symbols-outlined ${styles.leadingIcon}`}>
            search
          </span>
        )}
      </div>
      {error && <p className={styles.errorMsg}>{error}</p>}
      {helper && !error && <p className={styles.helperMsg}>{helper}</p>}
    </div>
  )
})

export default Input
