import { useLanguage } from '../../context/LanguageContext'
import styles from './CsvColumnMapper.module.css'

const COMPASS_FIELDS = ['date', 'amount', 'description', 'direction']

const FIELD_ICONS = {
  date: 'calendar_today',
  amount: 'payments',
  description: 'receipt_long',
  direction: 'swap_vert',
}

export default function CsvColumnMapper({ headers, mapping, onChange, sampleRows = [] }) {
  const { t } = useLanguage()

  function setFieldForColumn(header, field) {
    // If another column already maps to this field, unset it first
    const updated = { ...mapping }
    if (field) {
      for (const h of Object.keys(updated)) {
        if (updated[h] === field && h !== header) updated[h] = ''
      }
    }
    updated[header] = field
    onChange(updated)
  }

  const mappedFields = new Set(Object.values(mapping).filter(Boolean))
  const missingFields = COMPASS_FIELDS.filter(f => !mappedFields.has(f))

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerRow}>
        <h3 className={`text-h3 ${styles.title}`}>{t('csv_map_title')}</h3>
        <p className={`text-body-md ${styles.subtitle}`}>{t('csv_map_subtitle')}</p>
      </div>

      {missingFields.length > 0 && (
        <div className={styles.missingBanner}>
          <span className={`material-symbols-outlined ${styles.missingIcon}`}>warning</span>
          <span>
            {t('csv_map_missing_fields')}:{' '}
            <strong>{missingFields.map(f => t(`csv_field_${f}`)).join(', ')}</strong>
          </span>
        </div>
      )}

      <div className={styles.table}>
        {/* Header row */}
        <div className={`${styles.row} ${styles.rowHead}`}>
          <span>{t('csv_map_col_your_column')}</span>
          <span>{t('csv_map_col_sample')}</span>
          <span>{t('csv_map_col_maps_to')}</span>
        </div>

        {headers.map((header) => {
          const sample = sampleRows.slice(0, 2).map(r => String(r[header] ?? '')).filter(Boolean).join(' / ')
          const currentField = mapping[header] || ''

          return (
            <div key={header} className={styles.row}>
              <span className={styles.colName} dir="auto">{header}</span>
              <span className={styles.sampleVal} dir="auto">{sample || '—'}</span>
              <select
                className={`${styles.select} ${currentField ? styles.selectMapped : ''}`}
                value={currentField}
                onChange={(e) => setFieldForColumn(header, e.target.value)}
              >
                <option value="">{t('csv_map_skip')}</option>
                {COMPASS_FIELDS.map(f => (
                  <option key={f} value={f}>
                    {t(`csv_field_${f}`)}
                  </option>
                ))}
              </select>
            </div>
          )
        })}
      </div>

      {/* Field legend */}
      <div className={styles.legend}>
        {COMPASS_FIELDS.map(f => (
          <div key={f} className={`${styles.legendItem} ${mappedFields.has(f) ? styles.legendMapped : styles.legendMissing}`}>
            <span className={`material-symbols-outlined ${styles.legendIcon}`}>{FIELD_ICONS[f]}</span>
            <span>{t(`csv_field_${f}`)}</span>
            {mappedFields.has(f)
              ? <span className={`material-symbols-outlined ${styles.checkIcon}`}>check_circle</span>
              : <span className={`material-symbols-outlined ${styles.warnIcon}`}>radio_button_unchecked</span>
            }
          </div>
        ))}
      </div>
    </div>
  )
}
