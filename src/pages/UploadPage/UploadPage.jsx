import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeaderSection from '../../components/PageHeaderSection/PageHeaderSection'
import StepperSection from '../../components/StepperSection/StepperSection'
import DocumentTypeSection from '../../components/DocumentTypeSection/DocumentTypeSection'
import InstitutionSelectorSection from '../../components/InstitutionSelectorSection/InstitutionSelectorSection'
import FileUploadSection from '../../components/FileUploadSection/FileUploadSection'
import TipsSection from '../../components/TipsSection/TipsSection'
import FormActionsSection from '../../components/FormActionsSection/FormActionsSection'
import styles from './UploadPage.module.css'

const STEPS = [
  { label: 'Choose Type' },
  { label: 'Upload File' },
  { label: 'AI Processing' },
  { label: 'Review & Save' },
]

export default function UploadPage() {
  const navigate = useNavigate()

  const [docType, setDocType]         = useState('bank')
  const [institution, setInstitution] = useState('')
  const [file, setFile]               = useState(null)

  const canContinue = docType && institution && file

  return (
    <div className={styles.page}>
      {/* Transactional header — replaces full Navbar on upload flow */}
      <PageHeaderSection onCancel={() => navigate('/dashboard')} />

      <main className={styles.main}>
        {/* ── Page title + stepper ── */}
        <section className={styles.topSection}>
          <div>
            <h1 className={`text-h1 ${styles.pageTitle}`}>Secure Upload</h1>
            <p className={styles.pageSubtitle}>
              Submit your financial documents for secure AI processing and storage.
            </p>
          </div>

          <StepperSection steps={STEPS} currentStep={2} />
        </section>

        {/* ── Bento grid: form (8 cols) + tips sidebar (4 cols) ── */}
        <div className={styles.bento}>
          {/* Primary form column */}
          <div className={styles.formCol}>
            <div className={styles.configCard}>
              <DocumentTypeSection value={docType} onChange={setDocType} />
              <InstitutionSelectorSection value={institution} onChange={setInstitution} />
            </div>
            <FileUploadSection file={file} onFileChange={setFile} />
          </div>

          {/* Tips sidebar */}
          <div className={styles.sidebar}>
            <TipsSection />
          </div>
        </div>

        {/* ── Action footer ── */}
        <FormActionsSection
          onCancel={() => navigate('/dashboard')}
          onContinue={() => {}}
          disabled={!canContinue}
        />
      </main>
    </div>
  )
}
