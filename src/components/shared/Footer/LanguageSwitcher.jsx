import { useLanguage } from '../../../context/LanguageContext'
import styles from './LanguageSwitcher.module.css'

const LANGS = [
  { value: 'en', label: 'EN' },
  { value: 'he', label: 'עב' },
]

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  return (
    <div className={styles.switcher} role="group" aria-label="Language">
      {LANGS.map((l) => (
        <button
          key={l.value}
          type="button"
          className={`${styles.btn} ${language === l.value ? styles.active : ''}`}
          onClick={() => setLanguage(l.value)}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}
