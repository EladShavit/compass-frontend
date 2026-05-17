import styles from './WelcomeHeaderSection.module.css'

export default function WelcomeHeaderSection({ name = 'Alex', updatedAt = 'Today, 09:41 AM' }) {
  return (
    <div className={styles.wrapper}>
      <div>
        <h1 className={`text-h1 ${styles.heading}`}>Welcome Back, {name}</h1>
        <p className={styles.sub}>Here&apos;s a summary of your financial momentum.</p>
      </div>
      <div className={styles.timestamp}>
        <p className={`text-label-caps ${styles.tsLabel}`}>Last Updated</p>
        <p className={styles.tsValue}>{updatedAt}</p>
      </div>
    </div>
  )
}
