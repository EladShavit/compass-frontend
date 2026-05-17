import styles from './PaginationSection.module.css'

/**
 * PaginationSection — prev / page numbers / next
 */
export default function PaginationSection({
  currentPage = 1,
  totalPages = 3,
  onPageChange,
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className={styles.bar} aria-label="Pagination">
      {/* Prev */}
      <button
        type="button"
        className={styles.navBtn}
        disabled={currentPage === 1}
        onClick={() => onPageChange?.(currentPage - 1)}
        aria-label="Previous page"
      >
        <span className="material-symbols-outlined">chevron_left</span>
      </button>

      {/* Page numbers */}
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          className={`${styles.pageBtn} ${p === currentPage ? styles.active : ''}`}
          onClick={() => onPageChange?.(p)}
          aria-current={p === currentPage ? 'page' : undefined}
        >
          {p}
        </button>
      ))}

      {/* Next */}
      <button
        type="button"
        className={styles.navBtn}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange?.(currentPage + 1)}
        aria-label="Next page"
      >
        <span className="material-symbols-outlined">chevron_right</span>
      </button>
    </div>
  )
}
