import { useState } from 'react'
import FilterChip from '../FilterChip/FilterChip'
import styles from './AlertsFilterBarSection.module.css'

const FILTERS = [
  { id: 'all',           label: 'All Alerts',    dot: null },
  { id: 'critical',      label: 'Critical',      dot: 'error' },
  { id: 'opportunities', label: 'Opportunities', dot: 'secondary' },
  { id: 'duplicates',    label: 'Duplicates',    dot: 'tertiary' },
]

export default function AlertsFilterBarSection({ activeFilter, onFilterChange }) {
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
        Sort by: Priority
      </button>
    </div>
  )
}
