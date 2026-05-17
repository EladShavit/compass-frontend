import styles from './ExpenseChartSection.module.css'

const BARS = [
  { month: 'Jan', height: 40, value: '$8k',  color: 'default' },
  { month: 'Feb', height: 60, value: '$12k', color: 'default' },
  { month: 'Mar', height: 85, value: '$17k', color: 'tertiary' },
  { month: 'Apr', height: 30, value: '$6k',  color: 'default' },
  { month: 'May', height: 50, value: '$10k', color: 'secondary' },
  { month: 'Jun', height: 75, value: '$15k', color: 'default' },
]

const Y_LABELS = ['$20k', '$10k', '$0']

export default function ExpenseChartSection() {
  return (
    <section className={styles.wrapper} aria-label="Spending Trends">
      {/* Header */}
      <div className={styles.header}>
        <h3 className={`text-h3 ${styles.title}`}>Spending Trends</h3>
        <button className={styles.detailsBtn} type="button">
          View Details
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chevron_right</span>
        </button>
      </div>

      {/* Chart area */}
      <div className={styles.chartArea}>
        {/* Y-axis */}
        <div className={styles.yAxis}>
          {Y_LABELS.map((l) => <span key={l}>{l}</span>)}
        </div>

        {/* Grid + bars */}
        <div className={styles.barsContainer}>
          {/* Grid lines */}
          <div className={styles.gridLines} aria-hidden="true">
            <div className={styles.gridLine} />
            <div className={styles.gridLine} />
            <div className={styles.gridLine} />
          </div>

          {/* Bars */}
          <div className={styles.bars}>
            {BARS.map((bar) => (
              <div key={bar.month} className={styles.barCol}>
                <div className={styles.tooltipWrap}>
                  <div
                    className={`${styles.bar} ${styles[`bar-${bar.color}`]}`}
                    style={{ height: `${bar.height}%` }}
                  />
                  <span className={styles.tooltip}>{bar.value}</span>
                </div>
                <span className={styles.xLabel}>{bar.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
