import { useRef, useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import styles from './FileUploadSection.module.css'

export default function FileUploadSection({ file, onFileChange, accept = '.pdf,.csv,.jpg,.jpeg,.png' }) {
  const acceptedTypes = accept.split(',').map(e => e.replace('.', '').toUpperCase().replace('JPEG', 'JPG'))
  const { t } = useLanguage()
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
        {t('upload_file_label')}
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
          accept={accept}
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
                {(file.size / 1024 / 1024).toFixed(2)} MB &middot; {t('upload_click_replace')}
              </p>
            </>
          ) : (
            <>
              <h3 className={`text-h3 ${styles.heading} ${isDragging ? styles.headingDragging : ''}`}>
                {t('upload_drag_drop')}
              </h3>
              <p className={styles.subheading}>{t('upload_or_browse')}</p>
            </>
          )}

          <div className={styles.chips}>
            {acceptedTypes.map((type) => (
              <span key={type} className={styles.chip}>{type}</span>
            ))}
            <span className={styles.maxSize}>{t('upload_max_size')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
