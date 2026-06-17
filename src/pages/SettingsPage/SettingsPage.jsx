import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useCurrency, SUPPORTED_CURRENCIES, CURRENCY_LABELS } from '../../context/CurrencyContext'
import Button from '../../components/Button/Button'
import Input from '../../components/Input/Input'
import Modal from '../../components/Modal/Modal'
import { useLanguage } from '../../context/LanguageContext'
import styles from './SettingsPage.module.css'

function Section({ title, children }) {
  return (
    <div className={styles.section}>
      <h2 className={`text-h3 ${styles.sectionTitle}`}>{title}</h2>
      <div className={styles.sectionBody}>{children}</div>
    </div>
  )
}

function ToggleRow({ label, description, checked, onChange }) {
  return (
    <div className={styles.toggleRow}>
      <div>
        <p className={styles.toggleLabel}>{label}</p>
        {description && <p className={styles.toggleDesc}>{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        className={`${styles.toggle} ${checked ? styles.toggleOn : ''}`}
        onClick={() => onChange(!checked)}
      >
        <span className={styles.toggleThumb} />
      </button>
    </div>
  )
}

export default function SettingsPage() {
  const { t } = useLanguage()
  const { currency, setCurrency } = useCurrency()
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [pushAlerts, setPushAlerts] = useState(false)
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState(false)
  const [pwLoading, setPwLoading] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  async function handleChangePassword(e) {
    e.preventDefault()
    if (newPw !== confirmPw) {
      setPwError(t('settings_passwords_mismatch'))
      return
    }
    if (newPw.length < 8) {
      setPwError(t('settings_password_too_short'))
      return
    }
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

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className="text-h1">{t('settings_title')}</h1>
        <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>
          {t('settings_subtitle')}
        </p>
      </header>

      <Section title={t('settings_section_display')}>
        <div className={styles.fieldRow}>
          <div>
            <p className={styles.toggleLabel}>{t('settings_currency_label')}</p>
            <p className={styles.toggleDesc}>{t('settings_currency_desc')}</p>
          </div>
          <select
            className={styles.currencySelect}
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            {SUPPORTED_CURRENCIES.map((code) => (
              <option key={code} value={code}>{CURRENCY_LABELS[code]}</option>
            ))}
          </select>
        </div>
      </Section>

      <Section title={t('settings_section_notifications')}>
        <ToggleRow
          label={t('settings_email_alerts_label')}
          description={t('settings_email_alerts_desc')}
          checked={emailAlerts}
          onChange={setEmailAlerts}
        />
        <ToggleRow
          label={t('settings_push_alerts_label')}
          description={t('settings_push_alerts_desc')}
          checked={pushAlerts}
          onChange={setPushAlerts}
        />
      </Section>

      <Section title={t('settings_section_security')}>
        <form className={styles.pwForm} onSubmit={handleChangePassword}>
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
      </Section>

      <Section title={t('settings_section_danger')}>
        <div className={styles.dangerRow}>
          <div>
            <p className={styles.dangerLabel}>{t('settings_delete_account_label')}</p>
            <p className={styles.dangerDesc}>
              {t('settings_delete_account_desc')}
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteModal(true)}
            style={{ borderColor: 'var(--color-error)', color: 'var(--color-error)' }}
          >
            {t('settings_delete_account_btn')}
          </Button>
        </div>
      </Section>

      <Modal
        open={showDeleteModal}
        title={t('settings_delete_modal_title')}
        onClose={() => setShowDeleteModal(false)}
      >
          <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>
            {t('settings_delete_modal_body')}
          </p>
          <div className={styles.modalActions}>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>{t('settings_cancel')}</Button>
          </div>
        </Modal>
    </div>
  )
}
