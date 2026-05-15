import styles from './FooterLinks.module.css'

const LINKS = ['About', 'Privacy', 'Terms', 'Contact']

export default function FooterLinks() {
  return (
    <nav className={styles.nav} aria-label="Footer navigation">
      {LINKS.map((link) => (
        <a key={link} href="#" className={styles.link}>
          {link}
        </a>
      ))}
    </nav>
  )
}
