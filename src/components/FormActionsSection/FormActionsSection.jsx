import Button from '../Button/Button'
import { useLanguage } from '../../context/LanguageContext'
import styles from './FormActionsSection.module.css'

export default function FormActionsSection({ onCancel, onContinue, disabled = false, cancelLabel, continueLabel }) {
  const { t } = useLanguage()
  const resolvedCancelLabel = cancelLabel ?? t('upload_cancel_action')
  const resolvedContinueLabel = continueLabel ?? t('upload_continue_to_review')
  return (
    <div className={styles.bar}>
      <Button
        variant="ghost"
        size="lg"
        onClick={onCancel}
        id="upload-cancel-btn"
      >
        {resolvedCancelLabel}
      </Button>
      <Button
        variant="primary"
        size="lg"
        icon="arrow_forward"
        iconPosition="right"
        onClick={onContinue}
        disabled={disabled}
        id="upload-continue-btn"
      >
        {resolvedContinueLabel}
      </Button>
    </div>
  )
}
