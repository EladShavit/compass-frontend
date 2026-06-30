import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useCurrency } from '../../context/CurrencyContext'
import styles from './BudgetProgressSection.module.css'

export default function BudgetProgressSection({ budgets = [] }) {
  const { t, tCat } = useLanguage()
  const { formatAmount } = useCurrency()
  const navigate = useNavigate()

  if (budgets.length === 0) {
    return (
      <section className={styles.wrapper}>
        <div className={styles.header}>
          <h3 className={`text-h3 ${styles.title}`}>{t('budget_section_title')}</h3>
          <button className={styles.manageBtn} type="button" onClick={() => navigate('/settings')}>
            {t('budget_manage')}
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chevron_right</span>
          </button>
        </div>
        <div className={styles.empty}>
          <span className="material-symbols-outlined" style={{ fontSize: 40, color: 'var(--color-on-surface-variant)' }}>account_balance_wallet</span>
          <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)', marginTop: 8 }}>
            {t('budget_empty_state')}
          </p>
          <button className={styles.addFirstBtn} type="button" onClick={() => navigate('/settings')}>
            {t('budget_add_first')}
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.wrapper}>
      <div className={styles.header}>
        <h3 className={`text-h3 ${styles.title}`}>{t('budget_section_title')}</h3>
        <button className={styles.manageBtn} type="button" onClick={() => navigate('/settings')}>
          {t('budget_manage')}
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chevron_right</span>
        </button>
      </div>

      <div className={styles.list}>
        {budgets.map((b) => (
          <div key={b.id} className={styles.budgetRow}>
            <div className={styles.rowTop}>
              <span className={styles.catName}>{tCat(b.category_name)}</span>
              <span className={`${styles.amounts} ${b.isOverBudget ? styles.overBudget : ''}`}>
                {formatAmount(b.spent)} / {formatAmount(b.monthly_limit)}
              </span>
            </div>
            <div className={styles.barBg}>
              <div
                className={`${styles.barFill} ${b.isOverBudget ? styles.barOver : b.isNearLimit ? styles.barNear : styles.barOk}`}
                style={{ width: `${b.pct}%` }}
              />
            </div>
            <div className={styles.rowBottom}>
              {b.isOverBudget ? (
                <span className={styles.statusOver}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>warning</span>
                  {t('budget_over_limit')}
                </span>
              ) : b.isNearLimit ? (
                <span className={styles.statusNear}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>info</span>
                  {t('budget_near_limit')}
                </span>
              ) : (
                <span className={styles.statusOk}>
                  {formatAmount(Number(b.monthly_limit) - b.spent)} {t('budget_remaining')}
                </span>
              )}
              <span className={styles.pct}>{Math.round(b.pct)}%</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
