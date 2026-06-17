import { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import styles from './ContactPage.module.css'

export default function ContactPage() {
  const { t } = useLanguage()
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <h1 className="text-h1">{t('contact_title')}</h1>
        <p className={`text-body-lg ${styles.subtitle}`}>{t('contact_subtitle')}</p>
      </header>

      <div className={styles.layout}>
        <form className={styles.form} onSubmit={handleSubmit}>
          {sent ? (
            <div className={styles.success}>
              <span className="material-symbols-outlined" style={{ fontSize: 40, color: 'var(--color-secondary)' }}>check_circle</span>
              <p className="text-h3">{t('contact_success_title')}</p>
              <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>{t('contact_success_body')}</p>
            </div>
          ) : (
            <>
              <div className={styles.field}>
                <label className={styles.label}>{t('contact_name_label')}</label>
                <input className={styles.input} name="name" value={form.name} onChange={handleChange} required placeholder={t('contact_name_placeholder')} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>{t('contact_email_field_label')}</label>
                <input className={styles.input} name="email" type="email" value={form.email} onChange={handleChange} required placeholder={t('contact_email_placeholder')} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>{t('contact_message_label')}</label>
                <textarea className={styles.textarea} name="message" value={form.message} onChange={handleChange} required rows={5} placeholder={t('contact_message_placeholder')} />
              </div>
              <button className={styles.submit} type="submit">
                <span className="material-symbols-outlined">send</span>
                {t('contact_submit')}
              </button>
            </>
          )}
        </form>

        <div className={styles.info}>
          <div className={styles.infoItem}>
            <span className={`material-symbols-outlined ${styles.infoIcon}`}>mail</span>
            <div>
              <p className={styles.infoLabel}>{t('contact_email_label')}</p>
              <p className={styles.infoValue}>support@compass-finance.app</p>
            </div>
          </div>
          <div className={styles.infoItem}>
            <span className={`material-symbols-outlined ${styles.infoIcon}`}>schedule</span>
            <div>
              <p className={styles.infoLabel}>{t('contact_hours_label')}</p>
              <p className={styles.infoValue}>{t('contact_hours_value')}</p>
            </div>
          </div>
          <div className={styles.infoItem}>
            <span className={`material-symbols-outlined ${styles.infoIcon}`}>location_on</span>
            <div>
              <p className={styles.infoLabel}>{t('contact_location_label')}</p>
              <p className={styles.infoValue}>Tel Aviv, Israel</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
