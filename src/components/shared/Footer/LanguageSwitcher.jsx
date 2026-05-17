import { useState } from 'react'
import styles from './LanguageSwitcher.module.css'

const LANGS = [
  { value: 'en', label: 'EN' },
  { value: 'he', label: 'עב' },
]

export default function LanguageSwitcher() {
  const [lang, setLang] = useState('en')
  return (
    <div className={styles.switcher} role="group" aria-label="Language">
      {LANGS.map((l) => (
        <button
          key={l.value}
          type="button"
          className={`${styles.btn} ${lang === l.value ? styles.active : ''}`}
          onClick={() => setLang(l.value)}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}
