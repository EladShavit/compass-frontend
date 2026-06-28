import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { supabase } from '../../lib/supabase'
import styles from './OnboardingPage.module.css'

const ACCOUNT_TYPES = ['Checking', 'Savings', 'Credit', 'Investment']
const TOTAL_STEPS = 3

export default function OnboardingPage() {
  const { t, dir } = useLanguage()
  const { user, profile, setProfile } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [accountName, setAccountName] = useState('')
  const [accountType, setAccountType] = useState('Checking')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [skipped, setSkipped] = useState(false)

  const displayName = profile?.display_name || profile?.first_name || user?.email?.split('@')[0] || 'there'

  async function markComplete() {
    setSaving(true)
    try {
      await supabase
        .from('profiles')
        .update({ onboarding_complete: true })
        .eq('user_id', user.id)
      setProfile(prev => ({ ...prev, onboarding_complete: true }))
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleCreateAccount() {
    if (!accountName.trim()) return
    setSaving(true)
    setError(null)
    try {
      const { error: insertErr } = await supabase
        .from('accounts')
        .insert({ name: accountName.trim(), type: accountType, user_id: user.id })
      if (insertErr) throw insertErr
      setStep(3)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  function handleSkipAccount() {
    setSkipped(true)
    setStep(3)
  }

  return (
    <div className={styles.root} dir={dir}>
      {/* Progress bar */}
      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${(step / TOTAL_STEPS) * 100}%` }} />
      </div>

      <div className={styles.card}>
        {/* Step 1 — Welcome */}
        {step === 1 && (
          <div className={styles.step}>
            <span className={`material-symbols-outlined ${styles.bigIcon}`}>explore</span>
            <h1 className={`text-h1 ${styles.title}`}>{t('onboarding_welcome_title').replace('{name}', displayName)}</h1>
            <p className={`text-body-lg ${styles.subtitle}`}>{t('onboarding_welcome_subtitle')}</p>

            <div className={styles.features}>
              {[
                { icon: 'upload_file', key: 'onboarding_feature_upload' },
                { icon: 'auto_awesome', key: 'onboarding_feature_analyze' },
                { icon: 'insights', key: 'onboarding_feature_insights' },
              ].map(f => (
                <div key={f.key} className={styles.featureRow}>
                  <span className={`material-symbols-outlined ${styles.featureIcon}`}>{f.icon}</span>
                  <span className={styles.featureText}>{t(f.key)}</span>
                </div>
              ))}
            </div>

            <button className={styles.primaryBtn} onClick={() => setStep(2)}>
              {t('onboarding_get_started')}
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        )}

        {/* Step 2 — Add account */}
        {step === 2 && (
          <div className={styles.step}>
            <span className={`material-symbols-outlined ${styles.bigIcon}`}>account_balance</span>
            <h2 className={`text-h2 ${styles.title}`}>{t('onboarding_account_title')}</h2>
            <p className={`text-body-md ${styles.subtitle}`}>{t('onboarding_account_subtitle')}</p>

            <div className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label}>{t('onboarding_account_name_label')}</label>
                <input
                  className={styles.input}
                  value={accountName}
                  onChange={e => setAccountName(e.target.value)}
                  placeholder={t('onboarding_account_name_placeholder')}
                  onKeyDown={e => e.key === 'Enter' && handleCreateAccount()}
                  autoFocus
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>{t('onboarding_account_type_label')}</label>
                <div className={styles.typeGrid}>
                  {ACCOUNT_TYPES.map(type => (
                    <button
                      key={type}
                      className={`${styles.typeBtn} ${accountType === type ? styles.typeBtnActive : ''}`}
                      onClick={() => setAccountType(type)}
                    >
                      {t(`account_type_${type.toLowerCase()}`)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.actions}>
              <button className={styles.primaryBtn} onClick={handleCreateAccount} disabled={!accountName.trim() || saving}>
                {saving ? t('onboarding_saving') : t('onboarding_account_cta')}
                {!saving && <span className="material-symbols-outlined">arrow_forward</span>}
              </button>
              <button className={styles.skipBtn} onClick={handleSkipAccount}>{t('onboarding_skip')}</button>
            </div>
          </div>
        )}

        {/* Step 3 — Upload */}
        {step === 3 && (
          <div className={styles.step}>
            <span className={`material-symbols-outlined ${styles.bigIcon}`}>upload_file</span>
            <h2 className={`text-h2 ${styles.title}`}>{t('onboarding_upload_title')}</h2>
            <p className={`text-body-md ${styles.subtitle}`}>{t('onboarding_upload_subtitle')}</p>

            <div className={styles.actions}>
              <button
                className={styles.primaryBtn}
                onClick={async () => { await markComplete(); navigate('/upload', { replace: true }) }}
                disabled={saving}
              >
                <span className="material-symbols-outlined">upload_file</span>
                {t('onboarding_upload_cta')}
              </button>
              <button className={styles.skipBtn} onClick={markComplete} disabled={saving}>
                {saving ? t('onboarding_saving') : t('onboarding_skip_to_dashboard')}
              </button>
            </div>
          </div>
        )}

        {/* Step indicator dots */}
        <div className={styles.dots}>
          {[1, 2, 3].map(i => (
            <span key={i} className={`${styles.dot} ${step === i ? styles.dotActive : ''}`} />
          ))}
        </div>
      </div>
    </div>
  )
}
