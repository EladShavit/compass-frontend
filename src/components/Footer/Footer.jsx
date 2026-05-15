import FooterLinks from './FooterLinks'
import Copyright from './Copyright'
import LanguageSwitcher from './LanguageSwitcher'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <Copyright />
        <FooterLinks />
        <LanguageSwitcher />
      </div>
    </footer>
  )
}
