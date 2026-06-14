import ExpenseChartSection from '../ExpenseChartSection/ExpenseChartSection'
import QuickActionsSection from '../QuickActionsSection/QuickActionsSection'
import styles from './ChartsRowSection.module.css'

/**
 * ChartsRowSection — 2/3 chart + 1/3 quick actions side by side
 */
export default function ChartsRowSection({ chartData = [] }) {
  return (
    <section className={styles.row} aria-label="Charts and Actions">
      <div className={styles.chart}>
        <ExpenseChartSection chartData={chartData} />
      </div>
      <div className={styles.actions}>
        <QuickActionsSection />
      </div>
    </section>
  )
}
