import { useState, useRef, useEffect } from 'react'
import FilterChip from '../FilterChip/FilterChip'
import { useLanguage } from '../../context/LanguageContext'
import styles from './AlertsFilterBarSection.module.css'

export default function AlertsFilterBarSection({ activeFilter, onFilterChange, sortOrder, onSortChange }) {
  const { t } = useLanguage()
  const [sortOpen, setSortOpen] = useState(false)
  const sortRef = useRef(null)

  useEffect(() => {
    function handler(e) {
      if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const FILTERS = [
    { id: 'all',           label: t('alerts_filter_all'),           dot: null },
    { id: 'critical',      label: t('alerts_filter_critical'),      dot: 'error' },
    { id: 'opportunities', label: t('alerts_filter_opportunities'), dot: 'secondary' },
    { id: 'duplicates',    label: t('alerts_filter_duplicates'),    dot: 'tertiary' },
  ]

  const SORT_OPTIONS = [
    { id: 'priority', label: t('alerts_sort_priority') },
    { id: 'newest',   label: t('alerts_sort_newest') },
    { id: 'oldest',   label: t('alerts_sort_oldest') },
  ]

  const currentSort = SORT_OPTIONS.find(o => o.id === sortOrder) || SORT_OPTIONS[0]

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

      {/* Sort dropdown */}
      <div className={styles.sortWrap} ref={sortRef}>
        <button
          type="button"
          className={`${styles.sortBtn} ${sortOpen ? styles.sortBtnActive : ''}`}
          onClick={() => setSortOpen(o => !o)}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>sort</span>
          {currentSort.label}
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
            {sortOpen ? 'expand_less' : 'expand_more'}
          </span>
        </button>
        {sortOpen && (
          <div className={styles.sortDropdown}>
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt.id}
                type="button"
                className={`${styles.sortItem} ${sortOrder === opt.id ? styles.sortItemActive : ''}`}
                onClick={() => { onSortChange(opt.id); setSortOpen(false) }}
              >
                {sortOrder === opt.id && (
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>check</span>
                )}
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
