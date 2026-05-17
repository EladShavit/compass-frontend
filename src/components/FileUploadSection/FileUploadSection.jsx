import { useRef, useState } from 'react'
import styles from './FileUploadSection.module.css'

const ACCEPTED_TYPES = ['PDF', 'CSV', 'JPG/PNG']
const MAX_SIZE_LABEL = 'Max 50MB'

export default function FileUploadSection({ file, onFileChange }) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef(null)

  function handleDrop(e) {
    e.preventDefault()
    setIsDragging(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped) onFileChange(dropped)
  }

  function handleDragOver(e) {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave() { setIsDragging(false) }
  function handleClick() { inputRef.current?.click() }

  function handleInputChange(e) {
    const picked = e.target.files[0]
    if (picked) onFileChange(picked)
  }

  return (
    <div className={styles.wrapper}>
      <label className={`text-label-caps ${styles.sectionLabel}`}>
        3. File Upload
      </label>

      <div
        className={`${styles.dropZone} ${isDragging ? styles.dragging : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleClick()}
        aria-label="Click or drag a file to upload"
      >
        <div className={styles.glow} aria-hidden="true" />

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.csv,.jpg,.jpeg,.png"
          className={styles.hiddenInput}
          onChange={handleInputChange}
          tabIndex={-1}
        />

        <div className={styles.content}>
          <div className={`${styles.iconCircle} ${isDragging ? styles.iconCircleDragging : ''}`}>
            <span className="material-symbols-outlined" style={{ fontSize: 32, color: 'var(--color-tertiary)' }}>
              {file ? 'check_circle' : 'cloud_upload'}
            </span>
          </div>

          {file ? (
            <>
              <p className={styles.heading} style={{ color: 'var(--color-tertiary)' }}>
                {file.name}
              </p>
              <p className={styles.subheading}>
                {(file.size / 1024 / 1024).toFixed(2)} MB &middot; Click to replace
              </p>
            </>
          ) : (
            <>
              <h3 className={`text-h3 ${styles.heading} ${isDragging ? styles.headingDragging : ''}`}>
                Drag &amp; drop your file here
              </h3>
              <p className={styles.subheading}>or click to browse from your computer</p>
            </>
          )}

          <div className={styles.chips}>
            {ACCEPTED_TYPES.map((t) => (
              <span key={t} className={styles.chip}>{t}</span>
            ))}
            <span className={styles.maxSize}>{MAX_SIZE_LABEL}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
