import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useAccounts } from '../../hooks/useAccounts'
import { parsePdfFile } from '../../lib/pdfParser'
import { parseSpreadsheetFile, buildInitialMapping, applyMapping } from '../../lib/spreadsheetParser'
import { supabase } from '../../lib/supabase'
import PageHeaderSection from '../../components/PageHeaderSection/PageHeaderSection'
import StepperSection from '../../components/StepperSection/StepperSection'
import DocumentTypeSection from '../../components/DocumentTypeSection/DocumentTypeSection'
import FileUploadSection from '../../components/FileUploadSection/FileUploadSection'
import TipsSection from '../../components/TipsSection/TipsSection'
import FormActionsSection from '../../components/FormActionsSection/FormActionsSection'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import UploadMethodSelector from '../../components/UploadMethodSelector/UploadMethodSelector'
import CsvColumnMapper from '../../components/CsvColumnMapper/CsvColumnMapper'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useTier } from '../../hooks/useTier'
import styles from './UploadPage.module.css'

const ACCOUNT_TYPES = ['Checking', 'Savings', 'Credit', 'Investment']

// ── New account inline form ──────────────────────────────────────────────────
function NewAccountForm({ onCreated }) {
  const { t } = useLanguage()
  const [institutions, setInstitutions] = useState([])
  const [institutionId, setInstitutionId] = useState('')
  const [name, setName] = useState('')
  const [type, setType] = useState('Checking')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.from('institutions').select('institution_id, name').eq('country', 'IL').order('name').then(({ data }) => {
      setInstitutions(data || [])
    })
  }, [])

  async function handleCreate() {
    if (!institutionId || !name.trim()) return
    setSaving(true)
    setError('')
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('accounts')
      .insert({ user_id: user.id, institution_id: institutionId, name: name.trim(), type, currency: 'ILS' })
      .select()
      .single()
    setSaving(false)
    if (error) { setError(error.message); return }
    onCreated(data)
  }

  return (
    <div className={styles.newAccountCard}>
      <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>
        {t('upload_no_accounts')}
      </p>
      <div className={styles.fieldGroup}>
        <label className={`text-label-caps ${styles.fieldLabel}`}>{t('upload_institution_label')}</label>
        <select className={styles.select} value={institutionId} onChange={(e) => setInstitutionId(e.target.value)}>
          <option value="">{t('upload_select_institution')}</option>
          {institutions.map((i) => (
            <option key={i.institution_id} value={i.institution_id}>{i.name}</option>
          ))}
        </select>
      </div>
      <div className={styles.fieldGroup}>
        <label className={`text-label-caps ${styles.fieldLabel}`}>{t('upload_account_name_label')}</label>
        <input className={styles.select} type="text" placeholder={t('upload_account_name_placeholder')} value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className={styles.fieldGroup}>
        <label className={`text-label-caps ${styles.fieldLabel}`}>{t('upload_account_type_label')}</label>
        <select className={styles.select} value={type} onChange={(e) => setType(e.target.value)}>
          {ACCOUNT_TYPES.map((at) => <option key={at} value={at}>{at}</option>)}
        </select>
      </div>
      {error && <p className={styles.errorMsg}>{error}</p>}
      <button type="button" className={styles.viewBtn} disabled={!institutionId || !name.trim() || saving} onClick={handleCreate}>
        {saving ? t('upload_adding') : t('upload_add_account')}
      </button>
    </div>
  )
}

// ── Step 1: Configure (account + method) ────────────────────────────────────
function StepConfigure({ docType, setDocType, accountId, setAccountId, accounts, onAccountCreated, method, setMethod }) {
  const { t } = useLanguage()
  const { isFree, limits } = useTier()
  const atAccountLimit = isFree && accounts.length >= limits.maxAccounts

  return (
    <div className={styles.configCard}>
      <UploadMethodSelector value={method} onChange={setMethod} />
      {method === 'pdf' && <DocumentTypeSection value={docType} onChange={setDocType} />}
      {accounts.length === 0 && !atAccountLimit ? (
        <NewAccountForm onCreated={onAccountCreated} />
      ) : (
        <div className={styles.fieldGroup}>
          <label className={`text-label-caps ${styles.fieldLabel}`}>{t('upload_account_label')}</label>
          <select className={styles.select} value={accountId} onChange={(e) => setAccountId(e.target.value)}>
            <option value="">{t('upload_select_account')}</option>
            {accounts.map((a) => (
              <option key={a.account_id} value={a.account_id}>{a.name}</option>
            ))}
          </select>
          {atAccountLimit && (
            <p className={styles.tierNudge}>
              <span className="material-symbols-outlined" style={{ fontSize: 16, verticalAlign: 'middle' }}>workspace_premium</span>
              {' '}Free plan is limited to {limits.maxAccounts} accounts.{' '}
              <Link to="/upgrade" style={{ color: 'var(--color-secondary)', fontWeight: 600 }}>Upgrade to Pro</Link> for unlimited.
            </p>
          )}
        </div>
      )}
    </div>
  )
}

// ── Step 3: Preview parsed transactions ──────────────────────────────────────
function StepPreview({ parsed, categories, onToggle }) {
  const { t } = useLanguage()
  return (
    <div className={styles.previewWrap}>
      <div className={styles.previewHeader}>
        <h3 className="text-h3">{t('upload_parsed_tx_title')}</h3>
        <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>
          {parsed.filter(r => r.include).length} {t('upload_selected_for_import').replace('{total}', parsed.length)}
        </p>
      </div>
      <div className={styles.tableScroll}>
        <table className={styles.previewTable}>
          <thead>
            <tr>
              <th>✓</th>
              <th>{t('upload_col_date')}</th>
              <th>{t('upload_col_description')}</th>
              <th>{t('upload_col_category')}</th>
              <th style={{ textAlign: 'right' }}>{t('upload_col_amount')} ₪</th>
            </tr>
          </thead>
          <tbody>
            {parsed.map((row, i) => {
              const cat = categories.find(c => c.category_id === row.category_id)
              return (
                <tr key={i} className={row.include ? '' : styles.rowExcluded}>
                  <td><input type="checkbox" checked={row.include} onChange={() => onToggle(i)} /></td>
                  <td>{row.date}</td>
                  <td className={styles.descCell} dir="auto">{row.description}</td>
                  <td>{cat?.name || '—'}</td>
                  <td style={{ textAlign: 'right' }}>{row.amount.toFixed(2)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function UploadPage() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { accounts, refetch: refetchAccounts } = useAccounts()

  const [method, setMethod] = useState('pdf')   // 'pdf' | 'csv'
  const [step, setStep] = useState(1)
  const [docType, setDocType] = useState('credit')
  const [accountId, setAccountId] = useState('')
  const [file, setFile] = useState(null)
  const [parsed, setParsed] = useState([])
  const [categories, setCategories] = useState([])
  const [processing, setProcessing] = useState(false)
  const [processError, setProcessError] = useState('')
  const [saveResult, setSaveResult] = useState(null)

  // CSV-specific state
  const [csvHeaders, setCsvHeaders] = useState([])
  const [csvRawRows, setCsvRawRows] = useState([])
  const [csvMapping, setCsvMapping] = useState({})

  const canStep1 = accountId
  const canStep2 = !!file

  // Steps differ by method:
  // PDF:  1=Configure, 2=Upload, 3=Preview, 4=Done
  // CSV:  1=Configure, 2=Upload, 3=Map Columns, 4=Preview, 5=Done
  const PDF_STEPS = [
    { label: t('upload_step_choose_type') },
    { label: t('upload_step_upload_file') },
    { label: t('upload_step_preview') },
    { label: t('upload_step_review_save') },
  ]
  const CSV_STEPS = [
    { label: t('upload_step_choose_type') },
    { label: t('upload_step_upload_file') },
    { label: t('upload_step_map_columns') },
    { label: t('upload_step_preview') },
    { label: t('upload_step_review_save') },
  ]
  const STEPS = method === 'csv' ? CSV_STEPS : PDF_STEPS

  // Reset file/parsed state when method changes
  function handleMethodChange(m) {
    setMethod(m)
    setFile(null)
    setParsed([])
    setProcessError('')
    setCsvHeaders([])
    setCsvRawRows([])
    setCsvMapping({})
    if (step > 1) setStep(1)
  }

  const fetchCategories = useCallback(async () => {
    if (categories.length > 0) return categories
    const { data } = await supabase.from('categories').select('category_id, name, icon')
    setCategories(data || [])
    return data || []
  }, [categories])

  // Step 1 → 2
  async function handleStep1Continue() {
    await fetchCategories()
    setStep(2)
  }

  // Step 2 → next: parse file
  async function handleParse() {
    if (!file) return
    setProcessing(true)
    setProcessError('')
    try {
      if (method === 'pdf') {
        const cats = await fetchCategories()
        const { transactions } = await parsePdfFile(file)
        if (transactions.length === 0) {
          setProcessError(t('upload_no_tx_found'))
          setProcessing(false)
          return
        }
        setParsed(transactions.map(tx => ({ ...tx, include: true })))
        setStep(3)
      } else {
        // CSV / Excel — parse and go to mapping step
        const { headers, rows } = await parseSpreadsheetFile(file)
        setCsvHeaders(headers)
        setCsvRawRows(rows)
        setCsvMapping(buildInitialMapping(headers))
        setStep(3)
      }
    } catch (err) {
      console.error(err)
      setProcessError(`${t('upload_parse_failed')} ${err.message}`)
    } finally {
      setProcessing(false)
    }
  }

  // CSV step 3 → 4: apply mapping and show preview
  function handleApplyMapping() {
    const rows = applyMapping(csvRawRows, csvMapping)
    if (rows.length === 0) {
      setProcessError(t('upload_no_tx_found_csv'))
      return
    }
    setProcessError('')
    setParsed(rows)
    setStep(4)
  }

  function toggleRow(index) {
    setParsed(prev => prev.map((r, i) => i === index ? { ...r, include: !r.include } : r))
  }

  // Save to Supabase (shared between PDF step 4 and CSV step 5)
  async function handleSave() {
    const toInsert = parsed.filter(r => r.include)
    if (toInsert.length === 0) return
    setProcessing(true)

    const { data: existing } = await supabase
      .from('transactions')
      .select('date, amount, description')
      .eq('account_id', accountId)

    const existingSet = new Set((existing || []).map(r => `${r.date}|${r.amount}|${r.description}`))

    const newRows = []
    let duplicateCount = 0
    for (const tx of toInsert) {
      const key = `${tx.date}|${tx.amount}|${tx.description}`
      if (existingSet.has(key)) {
        duplicateCount++
      } else {
        newRows.push({
          account_id: accountId,
          category_id: tx.category_id || null,
          date: tx.date,
          amount: tx.amount,
          direction: tx.direction,
          description: tx.description,
        })
      }
    }

    let insertedCount = 0
    let insertError = null
    if (newRows.length > 0) {
      const { data, error } = await supabase.from('transactions').insert(newRows).select()
      if (error) { console.error('Supabase insert error:', error); insertError = error.message }
      else insertedCount = data?.length ?? newRows.length
    }

    setProcessing(false)
    setSaveResult({ insertedCount, duplicateCount, insertError })
    setStep(method === 'csv' ? 5 : 4)
  }

  // Which step number is the "done" step
  const doneStep = method === 'csv' ? 5 : 4
  const previewStep = method === 'csv' ? 4 : 3
  const mapStep = 3  // CSV only

  return (
    <div className={styles.page}>
      <PageHeaderSection onCancel={() => navigate('/dashboard')} />

      <main className={styles.main}>
        <section className={styles.topSection}>
          <div>
            <h1 className={`text-h1 ${styles.pageTitle}`}>{t('upload_page_title')}</h1>
            <p className={styles.pageSubtitle}>{t('upload_page_subtitle')}</p>
          </div>
          <StepperSection steps={STEPS} currentStep={step} />
        </section>

        <div className={styles.bento}>
          <div className={styles.formCol}>
            {/* STEP 1: Configure */}
            {step === 1 && (
              <StepConfigure
                docType={docType} setDocType={setDocType}
                accountId={accountId} setAccountId={setAccountId}
                accounts={accounts}
                method={method} setMethod={handleMethodChange}
                onAccountCreated={async (account) => {
                  await refetchAccounts()
                  setAccountId(account.account_id)
                }}
              />
            )}

            {/* STEP 2: Upload file */}
            {step === 2 && (
              <>
                <FileUploadSection
                  file={file}
                  onFileChange={setFile}
                  accept={method === 'csv' ? '.csv,.xlsx,.xls' : '.pdf'}
                />
                {processError && <p className={styles.errorMsg}>{processError}</p>}
                {processing && (
                  <div className={styles.processingMsg}>
                    <LoadingSpinner />
                    <span>{method === 'csv' ? t('upload_parsing_csv') : t('upload_parsing_pdf')}</span>
                  </div>
                )}
              </>
            )}

            {/* STEP 3 (CSV only): Column mapping */}
            {step === mapStep && method === 'csv' && (
              <>
                <CsvColumnMapper
                  headers={csvHeaders}
                  mapping={csvMapping}
                  onChange={setCsvMapping}
                  sampleRows={csvRawRows.slice(0, 3)}
                />
                {processError && <p className={styles.errorMsg}>{processError}</p>}
              </>
            )}

            {/* STEP 3 (PDF) / STEP 4 (CSV): Preview */}
            {step === previewStep && (
              <StepPreview parsed={parsed} categories={categories} onToggle={toggleRow} />
            )}

            {/* DONE step */}
            {step === doneStep && saveResult && (
              <div className={styles.resultCard}>
                {saveResult.insertError ? (
                  <>
                    <span className={`material-symbols-outlined ${styles.resultIconError}`}>error</span>
                    <h2 className="text-h2">{t('upload_import_failed')}</h2>
                    <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>{saveResult.insertError}</p>
                  </>
                ) : (
                  <>
                    <span className={`material-symbols-outlined ${styles.resultIconSuccess}`}>task_alt</span>
                    <h2 className="text-h2">{t('upload_import_complete')}</h2>
                    <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>
                      {saveResult.insertedCount} {t('upload_imported_success')}
                      {saveResult.duplicateCount > 0 && (
                        <> <strong>{saveResult.duplicateCount} {t('upload_duplicates_skipped')}</strong></>
                      )}
                    </p>
                    <button className={styles.viewBtn} onClick={() => navigate('/transactions')}>
                      {t('upload_view_transactions')}
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {step <= 2 && (
            <div className={styles.sidebar}>
              <TipsSection />
            </div>
          )}
        </div>

        {/* Action footer */}
        {step === 1 && (
          <FormActionsSection
            onCancel={() => navigate('/dashboard')}
            onContinue={handleStep1Continue}
            disabled={!canStep1}
          />
        )}
        {step === 2 && (
          <FormActionsSection
            onCancel={() => setStep(1)}
            onContinue={handleParse}
            disabled={!canStep2 || processing}
            continueLabel={method === 'csv' ? t('upload_parse_csv') : t('upload_parse_pdf')}
          />
        )}
        {step === mapStep && method === 'csv' && (
          <FormActionsSection
            onCancel={() => setStep(2)}
            onContinue={handleApplyMapping}
            disabled={!Object.values(csvMapping).includes('date') || !Object.values(csvMapping).includes('amount') || !Object.values(csvMapping).includes('description')}
            continueLabel={t('upload_map_columns')}
          />
        )}
        {step === previewStep && (
          <FormActionsSection
            onCancel={() => setStep(method === 'csv' ? mapStep : 2)}
            onContinue={handleSave}
            disabled={parsed.filter(r => r.include).length === 0 || processing}
            continueLabel={processing ? t('upload_saving') : t('upload_import_n_transactions').replace('{count}', parsed.filter(r => r.include).length)}
          />
        )}
      </main>
    </div>
  )
}
