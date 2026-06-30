import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useCurrency, SUPPORTED_CURRENCIES, CURRENCY_LABELS } from '../../context/CurrencyContext'
import Button from '../../components/Button/Button'
import Input from '../../components/Input/Input'
import Modal from '../../components/Modal/Modal'
import { useLanguage } from '../../context/LanguageContext'
import { useAuth } from '../../context/AuthContext'
import { useBudgets } from '../../hooks/useBudgets'
import { useTransactions } from '../../hooks/useTransactions'
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

const KNOWN_CATEGORIES = [
  'Food & Drink', 'Groceries', 'Transport', 'Shopping', 'Health', 'Entertainment',
  'Housing', 'Utilities', 'Education', 'Travel', 'Subscriptions', 'Other',
]

function BudgetSection({ t, tCat, formatAmount }) {
  const { transactions } = useTransactions(200)
  const { budgets, addBudget, deleteBudget, updateBudget } = useBudgets(transactions)
  const [newCat, setNewCat] = useState(KNOWN_CATEGORIES[0])
  const [newLimit, setNewLimit] = useState('')
  const [formError, setFormError] = useState('')
  const [adding, setAdding] = useState(false)
  const [editId, setEditId] = useState(null)
  const [editLimit, setEditLimit] = useState('')

  async function handleAdd(e) {
    e.preventDefault()
    const limit = parseFloat(newLimit)
    if (!newCat || !limit || limit <= 0) { setFormError(t('budget_form_error')); return }
    setFormError('')
    setAdding(true)
    try {
      await addBudget(newCat, limit)
      setNewLimit('')
    } catch (err) {
      setFormError(err.message)
    } finally {
      setAdding(false)
    }
  }

  async function handleUpdate(id) {
    const limit = parseFloat(editLimit)
    if (!limit || limit <= 0) return
    await updateBudget(id, limit)
    setEditId(null)
  }

  const existingCats = new Set(budgets.map(b => b.category_name))
  const availableCats = KNOWN_CATEGORIES.filter(c => !existingCats.has(c))

  return (
    <div className={styles.sectionBody}>
      {budgets.length > 0 ? (
        <div className={styles.budgetList}>
          {budgets.map((b) => (
            <div key={b.id} className={styles.budgetItem}>
              <span className={styles.budgetCat}>{tCat(b.category_name)}</span>
              {editId === b.id ? (
                <>
                  <input
                    className={styles.budgetInput}
                    type="number"
                    min="1"
                    value={editLimit}
                    onChange={(e) => setEditLimit(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleUpdate(b.id); if (e.key === 'Escape') setEditId(null) }}
                    autoFocus
                  />
                  <div className={styles.budgetActions}>
                    <button className={styles.iconBtn} type="button" onClick={() => handleUpdate(b.id)} title="Save">
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>check</span>
                    </button>
                    <button className={styles.iconBtn} type="button" onClick={() => setEditId(null)} title="Cancel">
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span className={styles.budgetLimit}>{formatAmount(b.monthly_limit)}</span>
                  <div className={styles.budgetActions}>
                    <button className={styles.iconBtn} type="button" onClick={() => { setEditId(b.id); setEditLimit(String(b.monthly_limit)) }} title={t('budget_edit')}>
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>edit</span>
                    </button>
                    <button className={`${styles.iconBtn} ${styles.danger}`} type="button" onClick={() => deleteBudget(b.id)} title={t('budget_delete')}>
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>delete</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>{t('budget_none_set')}</p>
      )}

      {availableCats.length > 0 && (
        <form className={styles.addBudgetForm} onSubmit={handleAdd}>
          <select className={styles.budgetSelect} value={newCat} onChange={(e) => setNewCat(e.target.value)}>
            {availableCats.map((c) => <option key={c} value={c}>{tCat(c)}</option>)}
          </select>
          <input
            className={styles.budgetInput}
            type="number"
            min="1"
            placeholder={t('budget_limit_placeholder')}
            value={newLimit}
            onChange={(e) => setNewLimit(e.target.value)}
          />
          <Button type="submit" variant="primary" disabled={adding}>
            {adding ? t('budget_adding') : t('budget_add')}
          </Button>
          {formError && <p className={styles.budgetFormError}>{formError}</p>}
        </form>
      )}
    </div>
  )
}

export default function SettingsPage() {
  const { t, tCat } = useLanguage()
  const { currency, setCurrency, formatAmount } = useCurrency()
  const { profile, setProfile, session } = useAuth()
  const navigate = useNavigate()

  // Notification prefs — init from profile, fall back to true
  const [notifyCritical, setNotifyCritical] = useState(true)
  const [notifyWarning, setNotifyWarning] = useState(true)
  const [notifySaving, setNotifySaving] = useState(false)

  useEffect(() => {
    if (profile) {
      setNotifyCritical(profile.notify_critical ?? true)
      setNotifyWarning(profile.notify_warning ?? true)
    }
  }, [profile?.notify_critical, profile?.notify_warning])

  async function handleNotifToggle(field, value) {
    if (field === 'notify_critical') setNotifyCritical(value)
    else setNotifyWarning(value)
    setNotifySaving(true)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ [field]: value })
        .eq('user_id', session.user.id)
        .select()
        .single()
      if (error) throw error
      setProfile(data)
    } catch (err) {
      console.error('Failed to save notification preference:', err)
    } finally {
      setNotifySaving(false)
    }
  }

  // Password change
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState(false)
  const [pwLoading, setPwLoading] = useState(false)

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

  // Delete account
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  async function handleDeleteAccount() {
    if (deleteConfirmText !== 'DELETE') { setDeleteError(t('settings_delete_type_delete')); return }
    setDeleteError('')
    setDeleteLoading(true)
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-account`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${currentSession.access_token}`, 'Content-Type': 'application/json' },
      })
      const body = await res.json()
      if (!res.ok) throw new Error(body.error || 'Deletion failed')
      await supabase.auth.signOut()
      navigate('/login')
    } catch (err) {
      setDeleteError(err.message)
      setDeleteLoading(false)
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
        {notifySaving && (
          <p className={styles.toggleDesc} style={{ color: 'var(--color-secondary)', marginBottom: 4 }}>
            {t('settings_saving')}
          </p>
        )}
        <ToggleRow
          label={t('settings_critical_alerts_label')}
          description={t('settings_critical_alerts_desc')}
          checked={notifyCritical}
          onChange={(v) => handleNotifToggle('notify_critical', v)}
        />
        <ToggleRow
          label={t('settings_warning_alerts_label')}
          description={t('settings_warning_alerts_desc')}
          checked={notifyWarning}
          onChange={(v) => handleNotifToggle('notify_warning', v)}
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

      <Section title={t('settings_section_budgets')}>
        <BudgetSection t={t} tCat={tCat} formatAmount={formatAmount} />
      </Section>

      <Section title={t('settings_section_danger')}>
        <div className={styles.dangerRow}>
          <div>
            <p className={styles.dangerLabel}>{t('settings_delete_account_label')}</p>
            <p className={styles.dangerDesc}>{t('settings_delete_account_desc')}</p>
          </div>
          <Button
            variant="secondary"
            onClick={() => { setShowDeleteModal(true); setDeleteConfirmText(''); setDeleteError('') }}
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
        <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)', marginBottom: 'var(--space-md)' }}>
          {t('settings_delete_modal_body')}
        </p>
        <Input
          id="deleteConfirm"
          type="text"
          label={t('settings_delete_type_label')}
          placeholder="DELETE"
          icon="warning"
          value={deleteConfirmText}
          onChange={(e) => setDeleteConfirmText(e.target.value)}
          error={deleteError}
        />
        <div className={styles.modalActions} style={{ gap: 'var(--space-sm)' }}>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)} disabled={deleteLoading}>
            {t('settings_cancel')}
          </Button>
          <Button
            variant="primary"
            onClick={handleDeleteAccount}
            disabled={deleteLoading || deleteConfirmText !== 'DELETE'}
            style={{ background: 'var(--color-error)', borderColor: 'var(--color-error)' }}
          >
            {deleteLoading ? t('settings_deleting') : t('settings_delete_confirm_btn')}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
