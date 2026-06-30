import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import Button from '../../components/Button/Button'
import Input from '../../components/Input/Input'
import { useLanguage } from '../../context/LanguageContext'
import { useTier } from '../../hooks/useTier'
import styles from './ProfilePage.module.css'

export default function ProfilePage() {
  const { t } = useLanguage()
  const { user, profile, setProfile } = useAuth()
  const { isTrialing, trialDaysLeft, isPro } = useTier()
  const fileInputRef = useRef(null)

  const [displayName, setDisplayName] = useState('')
  const [firstName, setFirstName] = useState('')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const [avatarUrl, setAvatarUrl] = useState(null)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [avatarError, setAvatarError] = useState('')

  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState(false)
  const [pwLoading, setPwLoading] = useState(false)

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || '')
      setFirstName(profile.first_name || '')
      setAvatarUrl(profile.avatar_url || null)
    }
  }, [profile])

  // Email/password users — not OAuth
  const isEmailUser = user?.app_metadata?.provider === 'email' || !user?.app_metadata?.provider

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

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { setAvatarError(t('profile_avatar_too_large')); return }
    setAvatarError('')
    setAvatarUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const path = `${user.id}/avatar.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true, contentType: file.type })
      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path)
      const publicUrl = urlData.publicUrl + `?t=${Date.now()}`

      const { data, error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('user_id', user.id)
        .select()
        .single()
      if (updateError) throw updateError

      setAvatarUrl(publicUrl)
      setProfile(data)
    } catch (err) {
      setAvatarError(err.message || t('profile_avatar_upload_failed'))
    } finally {
      setAvatarUploading(false)
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault()
    if (newPw !== confirmPw) { setPwError(t('settings_passwords_mismatch')); return }
    if (newPw.length < 8) { setPwError(t('settings_password_too_short')); return }
    setPwError('')
    setPwLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: newPw })
      if (error) throw error
      setPwSuccess(true)
      setNewPw('')
      setConfirmPw('')
      setTimeout(() => setPwSuccess(false), 3000)
    } catch (err) {
      setPwError(err.message || t('settings_password_update_failed'))
    } finally {
      setPwLoading(false)
    }
  }

  const tierLabel = isPro
    ? isTrialing ? `${t('profile_tier_trial')} (${trialDaysLeft}d)` : t('profile_tier_pro')
    : t('profile_tier_free')

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className="text-h1">{t('profile_title')}</h1>
        <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>
          {t('profile_subtitle')}
        </p>
      </header>

      {/* Avatar + identity summary */}
      <div className={styles.card}>
        <div className={styles.avatarRow}>
          <div className={styles.avatarWrap}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="avatar" className={styles.avatarImg} />
            ) : (
              <div className={styles.avatar}>{initials}</div>
            )}
            <button
              type="button"
              className={styles.avatarEditBtn}
              onClick={() => fileInputRef.current?.click()}
              disabled={avatarUploading}
              title={t('profile_change_avatar')}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                {avatarUploading ? 'hourglass_empty' : 'photo_camera'}
              </span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleAvatarChange}
            />
          </div>
          <div>
            <p className={styles.name}>{profile?.display_name || user?.email}</p>
            <p className={styles.email}>{user?.email}</p>
            <span className={`${styles.tier} ${isPro ? styles.tierPro : styles.tierFree}`}>{tierLabel}</span>
          </div>
        </div>
        {avatarError && <p className={styles.error}>{avatarError}</p>}

        {/* Upgrade CTA for non-Pro users */}
        {!isPro && (
          <div className={styles.upgradeBanner}>
            <div>
              <p className={styles.upgradeTitle}>{t('profile_upgrade_title')}</p>
              <p className={styles.upgradeDesc}>{t('profile_upgrade_desc')}</p>
            </div>
            <Link to="/upgrade">
              <Button variant="primary" size="sm">
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>workspace_premium</span>
                {t('profile_upgrade_cta')}
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Display name / first name edit */}
      <div className={styles.card}>
        <h2 className={`text-h3 ${styles.cardTitle}`}>{t('profile_section_identity')}</h2>
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

      {/* Password change — email accounts only, hidden for Google/OAuth */}
      {isEmailUser && (
        <div className={styles.card}>
          <h2 className={`text-h3 ${styles.cardTitle}`}>{t('profile_section_password')}</h2>
          <form className={styles.form} onSubmit={handleChangePassword}>
            <Input
              id="newPw"
              type="password"
              label={t('settings_new_password_label')}
              placeholder="••••••••"
              icon="lock"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
            />
            <Input
              id="confirmPw"
              type="password"
              label={t('settings_confirm_password_label')}
              placeholder="••••••••"
              icon="lock"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              error={pwError}
            />
            {pwSuccess && <p className={styles.successMsg}>{t('settings_password_updated')}</p>}
            <div className={styles.formActions}>
              <Button type="submit" variant="primary" disabled={pwLoading}>
                {pwLoading ? t('settings_updating') : t('settings_update_password')}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
