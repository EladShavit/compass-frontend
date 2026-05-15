import styles from './Copyright.module.css'

export default function Copyright() {
  const year = new Date().getFullYear()
  return (
    <p className={styles.text}>
      © {year} Compass. All rights reserved.
    </p>
  )
}
