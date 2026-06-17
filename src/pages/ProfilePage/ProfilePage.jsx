import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import Button from '../../components/Button/Button'
import Input from '../../components/Input/Input'
import { useLanguage } from '../../context/LanguageContext'
import styles from './ProfilePage.module.css'

export default function ProfilePage() {
  const { t } = useLanguage()
  const { user, profile, setProfile } = useAuth()
  const [displayName, setDisplayName] = useState('')
  const [firstName, setFirstName] = useState('')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || '')
      setFirstName(profile.first_name || '')
    }
  }, [profile])

  const initials = (profile?.display_name || user?.email || '?')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess(false)
    try {
      const { data, error: updateError } = await supabase
        .from('profiles')
        .update({ display_name: displayName.trim(), first_name: firstName.trim() })
        .eq('user_id', user.id)
        .select()
        .single()
      if (updateError) throw updateError
      setProfile(data)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.message || t('profile_save_failed'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className="text-h1">{t('profile_title')}</h1>
        <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>
          {t('profile_subtitle')}
        </p>
      </header>

      <div className={styles.content}>
        <div className={styles.card}>
          <div className={styles.avatarRow}>
            <div className={styles.avatar}>{initials}</div>
            <div>
              <p className={styles.name}>{profile?.display_name || user?.email}</p>
              <p className={styles.email}>{user?.email}</p>
              <span className={styles.tier}>{profile?.tier || t('profile_tier_free')}</span>
            </div>
          </div>

          <form className={styles.form} onSubmit={handleSave}>
            <Input
              id="displayName"
              label={t('profile_display_name_label')}
              placeholder={t('profile_display_name_placeholder')}
              icon="person"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
            <Input
              id="firstName"
              label={t('profile_first_name_label')}
              placeholder={t('profile_first_name_placeholder')}
              icon="badge"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <Input
              id="email"
              label={t('profile_email_label')}
              type="email"
              icon="mail"
              value={user?.email || ''}
              disabled
            />

            {error && <p className={styles.error}>{error}</p>}
            {success && <p className={styles.successMsg}>{t('profile_save_success')}</p>}

            <div className={styles.formActions}>
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? t('profile_saving') : t('profile_save_changes')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
