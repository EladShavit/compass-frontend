import { Component } from 'react'
import styles from './ErrorBoundary.module.css'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      const { fallback } = this.props
      if (fallback) return fallback

      return (
        <div className={styles.wrapper}>
          <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--color-error)' }}>
            error_outline
          </span>
          <h2 className={styles.title}>Something went wrong</h2>
          <p className={styles.desc}>
            {this.state.error?.message || 'An unexpected error occurred in this section.'}
          </p>
          <button
            className={styles.reloadBtn}
            type="button"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>refresh</span>
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
