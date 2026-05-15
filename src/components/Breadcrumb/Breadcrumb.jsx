import styles from './Breadcrumb.module.css'

/**
 * Breadcrumb
 * items: [{ label, href? }]  — last item is current page (no href)
 */
export default function Breadcrumb({ items = [] }) {
  return (
    <nav className={styles.nav} aria-label="Breadcrumb">
      <ol className={styles.list}>
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <li key={item.label} className={styles.item}>
              {isLast ? (
                <span className={styles.current} aria-current="page">{item.label}</span>
              ) : (
                <>
                  <a href={item.href || '#'} className={styles.link}>{item.label}</a>
                  <span className={`material-symbols-outlined ${styles.sep}`}>chevron_right</span>
                </>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
