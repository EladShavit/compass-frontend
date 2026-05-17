import styles from './InstitutionSelectorSection.module.css'

const INSTITUTIONS = [
  { value: 'hapoalim', label: 'Bank Hapoalim' },
  { value: 'leumi',    label: 'Bank Leumi' },
  { value: 'discount', label: 'Discount Bank' },
  { value: 'mizrahi',  label: 'Mizrahi-Tefahot Bank' },
  { value: 'fibi',     label: 'First International Bank of Israel (FIBI)' },
]

export default function InstitutionSelectorSection({ value, onChange }) {
  return (
    <div className={styles.wrapper}>
      <label className={`text-label-caps ${styles.sectionLabel}`} htmlFor="institution-select">
        2. Financial Institution
      </label>
      <div className={styles.selectWrap}>
        <select
          id="institution-select"
          className={styles.select}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="" disabled>Select an institution...</option>
          {INSTITUTIONS.map((inst) => (
            <option key={inst.value} value={inst.value}>{inst.label}</option>
          ))}
        </select>
        <span className={`material-symbols-outlined ${styles.chevron}`}>expand_more</span>
      </div>
    </div>
  )
}
