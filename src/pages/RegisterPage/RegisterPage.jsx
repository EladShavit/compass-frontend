import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../../components/Button/Button'
import Input from '../../components/Input/Input'
import Divider from '../../components/Divider/Divider'
import Tooltip from '../../components/Tooltip/Tooltip'
import { auth } from '../../lib/auth'
import { useLanguage } from '../../context/LanguageContext'
import styles from '../LoginPage/LoginPage.module.css'

// Google "G" SVG icon
function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

export default function RegisterPage() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  async function handleGoogleSignUp() {
    setError('')
    setGoogleLoading(true)
    try {
      const { data, error: oauthError } = await auth.signInWithGoogle()
      if (oauthError) throw oauthError
      if (data?.session) navigate('/dashboard')
    } catch (err) {
      setError(err.message || t('register_google_failed'))
      setGoogleLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()

    // Aggressively clean the email: trim, remove zero-width spaces, remove quotes, and convert to lowercase
    const cleanEmail = email.replace(/[\u200B-\u200D\uFEFF]/g, '').replace(/["']/g, '').trim().toLowerCase()

    if (!cleanEmail || !password || !confirmPassword || !fullName) {
      setError(t('register_fill_all_fields'))
      return
    }

    if (password !== confirmPassword) {
      setError(t('register_passwords_mismatch'))
      return
    }
    
    setError('')
    setLoading(true)
    
    try {
      const { data, error } = await auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      })

      if (error) throw error
      
      // Update the profiles table with the user's name
      if (data?.user) {
        // Extract first name (everything before the first space)
        const firstName = fullName.split(' ')[0]
        
        // We use the real supabase client to hit the database directly, not the auth wrapper
        // The trigger on the backend already created the row with user_id and email
        const { supabase } = await import('../../lib/supabase')
        await supabase
          .from('profiles')
          .update({ 
            display_name: fullName,
            first_name: firstName 
          })
          .eq('user_id', data.user.id)
      }
      
      // If Supabase requires email confirmation, it returns a user but no session
      if (data?.user && !data?.session) {
        setError(t('register_email_confirm_required'))
        return
      }

      // If sign up is successful and a session exists, redirect to dashboard
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || t('register_failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      {/* Abstract Background */}
      <div className={styles.bg} aria-hidden="true">
        <div className={styles.bgGradient} />
        <div className={styles.bgOrb1} />
        <div className={styles.bgOrb2} />
        <div className={styles.bgOrb3} />
      </div>

      {/* Login Container */}
      <main className={styles.main}>
        {/* Glassmorphism Card */}
        <div className={styles.card}>

          {/* Brand Header */}
          <div className={styles.brandHeader}>
            <div className={styles.logoRow}>
              <span className={`material-symbols-outlined ${styles.logoIcon}`}>explore</span>
              <span className={styles.logoText}>Compass</span>
            </div>
            <h1 className={`text-h2 ${styles.heading}`}>{t('register_heading')}</h1>
            <p className={`text-body-md ${styles.subheading}`}>
              {t('register_subheading')}
            </p>
          </div>

          {/* Social Login */}
          <button
            type="button"
            className={styles.socialBtn}
            id="google-signup-btn"
            onClick={handleGoogleSignUp}
            disabled={googleLoading}
          >
            <GoogleIcon />
            <span className="text-body-md">{googleLoading ? t('login_google_redirecting') : t('register_google_signup')}</span>
          </button>

          {/* Divider */}
          <div className={styles.dividerWrapper}>
            <Divider label={t('login_or_email')} />
          </div>

          {/* Form */}
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              label={t('register_full_name_label')}
              placeholder="Sarah Jenkins"
              icon="person"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <Input
              id="email"
              name="email"
              type="email"
              label={t('register_email_label')}
              placeholder="name@company.com"
              icon="mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className={styles.passwordField}>
              <div className={styles.passwordHeader}>
                <label className={styles.passwordLabel} htmlFor="password">{t('register_password_label')}</label>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                icon="lock"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className={styles.passwordField}>
              <div className={styles.passwordHeader}>
                <label className={styles.passwordLabel} htmlFor="confirmPassword">{t('register_confirm_password_label')}</label>
              </div>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                icon="lock"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                error={error}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              icon="arrow_forward"
              iconPosition="right"
              disabled={loading}
              id="sign-up-btn"
            >
              {loading ? t('register_creating_account') : t('register_create_account')}
            </Button>
          </form>

          {/* Footer Link */}
          <div className={styles.signupRow}>
            <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>
              {t('register_have_account')}{' '}
              <Link className={styles.signupLink} to="/login">{t('register_log_in')}</Link>
            </p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className={styles.trustRow}>
          <Tooltip text={t('trust_encrypted_connection')} position="top">
            <span className={`material-symbols-outlined ${styles.trustIcon}`}>verified_user</span>
          </Tooltip>
          <Tooltip text={t('trust_secure_architecture')} position="top">
            <span className={`material-symbols-outlined ${styles.trustIcon}`}>shield</span>
          </Tooltip>
          <Tooltip text={t('trust_enterprise_grade')} position="top">
            <span className={`material-symbols-outlined ${styles.trustIcon}`}>domain</span>
          </Tooltip>
        </div>
      </main>
    </div>
  )
}
