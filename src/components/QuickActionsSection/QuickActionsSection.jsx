import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import styles from './QuickActionsSection.module.css'

export default function QuickActionsSection() {
  const navigate = useNavigate()
  const { t } = useLanguage()

  const ACTIONS = [
    { icon: 'upload_file',   label: t('quick_action_upload_statement'), to: '/upload' },
    { icon: 'receipt_long',  label: t('quick_action_view_transactions'), to: '/transactions' },
    { icon: 'notifications', label: t('quick_action_alerts_center'), to: '/alerts' },
  ]

  return (
    <section className={styles.wrapper} aria-label="Quick Actions">
      <h3 className={`text-h3 ${styles.title}`}>{t('quick_actions_title')}</h3>

      <div className={styles.actions}>
        {ACTIONS.map((action) => (
          <button key={action.label} type="button" className={styles.actionBtn} onClick={() => navigate(action.to)}>
            <div className={styles.btnLeft}>
              <div className={styles.iconBox}>
                <span className="material-symbols-outlined">{action.icon}</span>
              </div>
              <span className={styles.btnLabel}>{action.label}</span>
            </div>
            <span className={`material-symbols-outlined ${styles.arrow}`}>arrow_forward</span>
          </button>
        ))}
      </div>

      {/* Drop zone → navigate to upload */}
      <div
        className={styles.dropZone}
        role="button"
        tabIndex={0}
        aria-label="Upload documents"
        onClick={() => navigate('/upload')}
        onKeyDown={(e) => e.key === 'Enter' && navigate('/upload')}
      >
        <span className={`material-symbols-outlined ${styles.dropIcon}`}>cloud_upload</span>
        <p className={styles.dropText}>{t('quick_action_drop_zone')}</p>
      </div>
    </section>
  )
}
