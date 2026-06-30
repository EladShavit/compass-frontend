import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import styles from './ExpenseChartSection.module.css'

export default function ExpenseChartSection({ chartData = [] }) {
  const { t, tMonth } = useLanguage()
  const navigate = useNavigate()

  if (chartData.length === 0) {
    return (
      <section className={styles.wrapper} aria-label="Spending Trends">
        <div className={styles.header}>
          <div>
            <h3 className={`text-h3 ${styles.title}`}>{t('chart_spending_trends')}</h3>
          </div>
        </div>
        <div className={styles.emptyState}>
          <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>
            {t('chart_empty_state')}
          </p>
        </div>
      </section>
    )
  }

  const trueMax = Math.max(...chartData.map(d => d.value), 0)
  const maxVal = trueMax > 0 ? trueMax : 1  // 1 only used for bar-height math, never displayed
  const totalSpend = chartData.reduce((s, d) => s + d.value, 0)
  const avgSpend = chartData.length > 0 ? totalSpend / chartData.length : 0

  const now = new Date()
  const currentMonthLabel = now.toLocaleString('en', { month: 'short', year: 'numeric' })

  const bars = chartData.map(d => {
    const isCurrent = d.period_label === currentMonthLabel || d.period_label.startsWith(now.toLocaleString('en', { month: 'short' }))
    return {
      label: d.period_label,
      shortLabel: tMonth(d.period_label.substring(0, 3)),
      height: Math.max(Math.min((d.value / maxVal) * 100, 100), 4),
      raw: d.value,
      display: d.value >= 1000 ? `₪${(d.value / 1000).toFixed(1)}k` : `₪${d.value.toFixed(0)}`,
      isCurrent,
      isAboveAvg: d.value > avgSpend,
    }
  })

  const fmt = (v) => v >= 1000 ? `₪${(v / 1000).toFixed(1)}k` : `₪${v.toFixed(0)}`
  const translateLabel = (label) => {
    const [month, year] = label.split(' ')
    return `${tMonth(month)} ${year}`
  }
  const periodRange = `${translateLabel(chartData[0].period_label)} – ${translateLabel(chartData[chartData.length - 1].period_label)}`

  return (
    <section className={styles.wrapper} aria-label="Spending Trends">
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h3 className={`text-h3 ${styles.title}`}>{t('chart_spending_trends')}</h3>
          <p className={styles.subtitle}>{t('chart_subtitle')} · {periodRange}</p>
        </div>
        <button className={styles.detailsBtn} type="button" onClick={() => navigate('/transactions')}>
          {t('chart_view_details')}
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chevron_right</span>
        </button>
      </div>

      {/* Summary strip */}
      <div className={styles.summaryStrip}>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>{t('chart_total_label')} ({chartData.length} {t('chart_months')})</span>
          <span className={styles.summaryValue}>{fmt(totalSpend)}</span>
        </div>
        <div className={styles.summaryDivider} />
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>{t('chart_monthly_avg')}</span>
          <span className={styles.summaryValue}>{fmt(avgSpend)}</span>
        </div>
        <div className={styles.summaryDivider} />
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>{t('chart_peak_month')}</span>
          <span className={styles.summaryValue}>{fmt(trueMax)}</span>
        </div>
      </div>

      {/* Chart area */}
      <div className={styles.chartArea}>
        {/* Y-axis */}
        <div className={styles.yAxis}>
          <span>{fmt(trueMax)}</span>
          <span>{fmt(trueMax / 2)}</span>
          <span>₪0</span>
        </div>

        {/* Grid + bars */}
        <div className={styles.barsContainer}>
          {/* Grid lines */}
          <div className={styles.gridLines} aria-hidden="true">
            <div className={styles.gridLine} />
            <div className={styles.gridLine} />
            <div className={styles.gridLine} />
          </div>

          {/* Avg line */}
          <div
            className={styles.avgLine}
            style={{ bottom: `calc(${(avgSpend / maxVal) * 100}% + var(--space-lg))` }}
            aria-label={`Average: ${fmt(avgSpend)}`}
          />

          {/* Bars */}
          <div className={styles.bars}>
            {bars.map((bar, i) => (
              <div key={bar.label + i} className={styles.barCol}>
                <span className={`${styles.barValue} ${bar.isCurrent ? styles.barValueCurrent : ''}`}>
                  {bar.display}
                </span>
                <div className={styles.tooltipWrap}>
                  <div
                    className={`${styles.bar} ${bar.isCurrent ? styles.barCurrent : bar.isAboveAvg ? styles.barAboveAvg : styles.barDefault}`}
                    style={{ height: `${bar.height}%` }}
                  />
                </div>
                <span className={`${styles.xLabel} ${bar.isCurrent ? styles.xLabelCurrent : ''}`}>
                  {bar.shortLabel}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className={styles.legend}>
        <span className={`${styles.legendDot} ${styles.legendDotCurrent}`} /> {t('chart_legend_current')}
        <span className={`${styles.legendDot} ${styles.legendDotAbove}`} /> {t('chart_legend_above')}
        <span className={`${styles.legendDot} ${styles.legendDotDefault}`} /> {t('chart_legend_below')}
        <span className={styles.legendAvgLine} /> {t('chart_monthly_avg')}
      </div>
    </section>
  )
}
