import AlertItem from '../AlertItem/AlertItem'
import styles from './AlertsListSection.module.css'

const ALL_ALERTS = [
  {
    id: 1,
    category: 'critical',
    accentColor: 'error',
    icon: 'warning',
    iconColor: 'error',
    severityLabel: 'Critical Security',
    timestamp: '10 mins ago',
    title: 'Unusual Transaction Detected',
    description: (
      <>
        A transaction of <strong style={{ color: 'var(--color-on-surface)' }}>$12,450.00</strong> was
        initiated from an unrecognized IP address (Zurich, CH) on your Global Equity Account ending
        in <strong>...4492</strong>.
      </>
    ),
    primaryLabel: 'Review & Block',
    primaryVariant: 'error',
    secondaryLabel: 'Dismiss',
  },
  {
    id: 2,
    category: 'opportunities',
    accentColor: 'secondary',
    icon: 'lightbulb',
    iconColor: 'secondary',
    severityLabel: 'Yield Optimization',
    timestamp: '2 hours ago',
    title: 'Idle Cash Optimization Opportunity',
    description: (
      <>
        You have <strong style={{ color: 'var(--color-on-surface)' }}>$245,000</strong> in idle cash
        in your Primary Corporate Account. Transferring to the Compass High-Yield Treasury fund could
        generate an estimated <strong>$1,100/month</strong>.
      </>
    ),
    primaryLabel: 'Apply Strategy',
    primaryVariant: 'secondary',
    secondaryLabel: 'View Details',
  },
  {
    id: 3,
    category: 'duplicates',
    accentColor: 'tertiary',
    icon: 'content_copy',
    iconColor: 'tertiary',
    severityLabel: 'Billing Anomaly',
    timestamp: 'Yesterday',
    title: 'Potential Duplicate Vendor Charge',
    description: (
      <>
        Two identical charges of <strong style={{ color: 'var(--color-on-surface)' }}>$4,250.00</strong>{' '}
        were posted from <em>Salesforce EMEA</em> within 48 hours on your Operations Account.
        Review to prevent overpayment.
      </>
    ),
    primaryLabel: 'Dispute Charge',
    primaryVariant: 'tertiary',
    secondaryLabel: 'Ignore',
  },
]

export default function AlertsListSection({ activeFilter = 'all' }) {
  const filtered = activeFilter === 'all'
    ? ALL_ALERTS
    : ALL_ALERTS.filter((a) => a.category === activeFilter)

  return (
    <div className={styles.list} role="list">
      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--color-outline)' }}>
            check_circle
          </span>
          <p>No alerts in this category.</p>
        </div>
      ) : (
        filtered.map((alert) => (
          <AlertItem key={alert.id} {...alert} />
        ))
      )}
    </div>
  )
}
