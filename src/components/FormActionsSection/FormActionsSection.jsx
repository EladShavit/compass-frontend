import Button from '../Button/Button'
import styles from './FormActionsSection.module.css'

export default function FormActionsSection({ onCancel, onContinue, disabled = false }) {
  return (
    <div className={styles.bar}>
      <Button
        variant="ghost"
        size="lg"
        onClick={onCancel}
        id="upload-cancel-btn"
      >
        Cancel
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
        Continue to Review
      </Button>
    </div>
  )
}
