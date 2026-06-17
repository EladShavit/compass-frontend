import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAccounts } from '../../hooks/useAccounts'
import { useLanguage } from '../../context/LanguageContext'
import Modal from '../Modal/Modal'
import styles from './ManualEntryForm.module.css'

export default function ManualEntryForm({ open, onClose, onSaved }) {
  const { t } = useLanguage()
  const { accounts } = useAccounts()
  const [categories, setCategories] = useState([])

  const today = new Date().toISOString().split('T')[0]
  const [date, setDate] = useState(today)
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [direction, setDirection] = useState('debit')
  const [accountId, setAccountId] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Pre-select first account when accounts load
  useEffect(() => {
    if (accounts.length > 0 && !accountId) setAccountId(accounts[0].account_id)
  }, [accounts])

  // Load categories once
  useEffect(() => {
    if (!open) return
    supabase.from('categories').select('category_id, name, icon').then(({ data }) => {
      setCategories(data || [])
    })
  }, [open])

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setDate(today)
      setAmount('')
      setDescription('')
      setDirection('debit')
      setCategoryId('')
      setError('')
    }
  }, [open])

  async function handleSave() {
    const parsedAmount = parseFloat(amount)
    if (!date || !parsedAmount || !description.trim()) {
      setError(t('manual_err_required'))
      return
    }
    if (!accountId) {
      setError(t('upload_select_account'))
      return
    }

    setSaving(true)
    setError('')

    const { error: insertError } = await supabase.from('transactions').insert({
      account_id: accountId,
      category_id: categoryId || null,
      date,
      amount: Math.abs(parsedAmount),
      direction,
      description: description.trim(),
    })

    setSaving(false)

    if (insertError) {
      setError(insertError.message)
      return
    }

    onSaved?.()
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={t('manual_title')} size="md">
      <div className={styles.form}>

        {/* Date + Amount row */}
        <div className={styles.row2}>
          <div className={styles.field}>
            <label className={styles.label}>{t('manual_field_date')}</label>
            <input
              type="date"
              className={styles.input}
              value={date}
              max={today}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>{t('manual_field_amount')}</label>
            <input
              type="number"
              min="0"
              step="0.01"
              className={styles.input}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Direction toggle */}
        <div className={styles.field}>
          <label className={styles.label}>{t('manual_field_direction')}</label>
          <div className={styles.toggle}>
            <button
              type="button"
              className={`${styles.toggleBtn} ${direction === 'debit' ? styles.toggleActive : ''}`}
              onClick={() => setDirection('debit')}
            >
              <span className="material-symbols-outlined">arrow_upward</span>
              {t('manual_direction_debit')}
            </button>
            <button
              type="button"
              className={`${styles.toggleBtn} ${direction === 'credit' ? styles.toggleActiveCredit : ''}`}
              onClick={() => setDirection('credit')}
            >
              <span className="material-symbols-outlined">arrow_downward</span>
              {t('manual_direction_credit')}
            </button>
          </div>
        </div>

        {/* Description */}
        <div className={styles.field}>
          <label className={styles.label}>{t('manual_field_description')}</label>
          <input
            type="text"
            className={styles.input}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('manual_field_description')}
            dir="auto"
          />
        </div>

        {/* Account */}
        <div className={styles.field}>
          <label className={styles.label}>{t('manual_field_account')}</label>
          <select className={styles.input} value={accountId} onChange={(e) => setAccountId(e.target.value)}>
            <option value="">{t('upload_select_account')}</option>
            {accounts.map((a) => (
              <option key={a.account_id} value={a.account_id}>{a.name}</option>
            ))}
          </select>
        </div>

        {/* Category (optional) */}
        <div className={styles.field}>
          <label className={styles.label}>
            {t('manual_field_category')}
            <span className={styles.optional}> ({t('manual_optional')})</span>
          </label>
          <select className={styles.input} value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">—</option>
            {categories.map((c) => (
              <option key={c.category_id} value={c.category_id}>{c.icon} {c.name}</option>
            ))}
          </select>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button
          type="button"
          className={styles.saveBtn}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? t('manual_saving') : t('manual_save')}
        </button>
      </div>
    </Modal>
  )
}
