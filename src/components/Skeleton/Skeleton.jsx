import styles from './Skeleton.module.css'

export default function Skeleton({ width, height, borderRadius, className = '', style = {} }) {
  return (
    <div
      className={`${styles.bone} ${className}`}
      style={{ width, height, borderRadius, ...style }}
      aria-hidden="true"
    />
  )
}

export function KPICardSkeleton({ wide = false }) {
  return (
    <div className={styles.kpiCard} style={wide ? { gridColumn: 'span 2' } : {}}>
      <Skeleton width={40} height={40} borderRadius="10px" />
      <Skeleton width="60%" height={14} style={{ marginTop: 'auto' }} />
      <Skeleton width="80%" height={28} />
    </div>
  )
}
