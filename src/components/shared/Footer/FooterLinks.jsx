import { Link } from 'react-router-dom'
import { useLanguage } from '../../../context/LanguageContext'
import styles from './FooterLinks.module.css'

const LINKS = [
  { key: 'footer_about',   to: '/about' },
  { key: 'footer_privacy', to: '/privacy' },
  { key: 'footer_terms',   to: '/terms' },
  { key: 'footer_contact', to: '/contact' },
]

export default function FooterLinks() {
  const { t } = useLanguage()
  return (
    <nav className={styles.nav} aria-label="Footer navigation">
      {LINKS.map(({ key, to }) => (
        <Link key={key} to={to} className={styles.link}>
          {t(key)}
        </Link>
      ))}
    </nav>
  )
}
