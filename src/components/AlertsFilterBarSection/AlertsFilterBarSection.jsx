import { useState } from 'react'
import FilterChip from '../FilterChip/FilterChip'
import { useLanguage } from '../../context/LanguageContext'
import styles from './AlertsFilterBarSection.module.css'

export default function AlertsFilterBarSection({ activeFilter, onFilterChange }) {
  const { t } = useLanguage()

  const FILTERS = [
    { id: 'all',           label: t('alerts_filter_all'),           dot: null },
    { id: 'critical',      label: t('alerts_filter_critical'),      dot: 'error' },
    { id: 'opportunities', label: t('alerts_filter_opportunities'), dot: 'secondary' },
    { id: 'duplicates',    label: t('alerts_filter_duplicates'),    dot: 'tertiary' },
  ]

  return (
    <div className={styles.bar}>
      <div className={styles.chips}>
        {FILTERS.map((f) => (
          <FilterChip
            key={f.id}
            label={f.label}
            dot={f.dot}
            active={activeFilter === f.id}
            onClick={() => onFilterChange(f.id)}
          />
        ))}
      </div>

      {/* Sort button */}
      <button type="button" className={styles.sortBtn}>
        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>sort</span>
        {t('alerts_sort_by_priority')}
      </button>
    </div>
  )
}
