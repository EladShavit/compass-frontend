import styles from './AlertStatusTag.module.css'

/**
 * AlertStatusTag — NEW / IN PROGRESS / RESOLVED badge
 * status: 'new' | 'in-progress' | 'resolved'
 */
const CONFIG = {
  'new':         { label: 'New',         cls: 'new' },
  'in-progress': { label: 'In Progress', cls: 'inProgress' },
  'resolved':    { label: 'Resolved',    cls: 'resolved' },
}

export default function AlertStatusTag({ status = 'new' }) {
  const { label, cls } = CONFIG[status] ?? CONFIG['new']
  return <span className={`${styles.tag} ${styles[cls]}`}>{label}</span>
}
