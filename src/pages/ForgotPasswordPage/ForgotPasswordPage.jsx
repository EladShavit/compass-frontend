import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import Button from '../../components/Button/Button'
import Input from '../../components/Input/Input'
import { useLanguage } from '../../context/LanguageContext'
import styles from './ForgotPasswordPage.module.css'

export default function ForgotPasswordPage() {
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const cleanEmail = email.trim()
    if (!cleanEmail) {
      setError(t('forgot_enter_email'))
      return
    }
    setError('')
    setLoading(true)
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (resetError) throw resetError
      setSent(true)
    } catch (err) {
      setError(err.message || t('forgot_send_failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.bg} aria-hidden="true">
        <div className={styles.bgGradient} />
        <div className={styles.bgOrb1} />
        <div className={styles.bgOrb2} />
      </div>

      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.brandHeader}>
            <div className={styles.logoRow}>
              <span className={`material-symbols-outlined ${styles.logoIcon}`}>explore</span>
              <span className={styles.logoText}>Compass</span>
            </div>
            <h1 className={`text-h2 ${styles.heading}`}>{t('forgot_heading')}</h1>
            <p className={`text-body-md ${styles.subheading}`}>
              {t('forgot_subheading')}
            </p>
          </div>

          {sent ? (
            <div className={styles.successBox}>
              <span className={`material-symbols-outlined ${styles.successIcon}`}>mark_email_read</span>
              <p className="text-body-md">
                {t('forgot_check_inbox')} <strong>{email}</strong>.
              </p>
              <Link to="/login" className={styles.backLink}>{t('forgot_back_to_signin')}</Link>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <Input
                id="email"
                name="email"
                type="email"
                label={t('forgot_email_label')}
                placeholder="name@company.com"
                icon="mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                error={error}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                icon="send"
                iconPosition="right"
                disabled={loading}
              >
                {loading ? t('forgot_sending') : t('forgot_send_reset_link')}
              </Button>

              <div className={styles.backRow}>
                <Link to="/login" className={styles.backLink}>
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_back</span>
                  {t('forgot_back_to_signin')}
                </Link>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  )
}
