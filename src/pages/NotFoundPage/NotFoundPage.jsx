import { Link } from 'react-router-dom'
import Button from '../../components/Button/Button'

export default function NotFoundPage() {
  return (
    <div style={{ padding: 'var(--space-xl)', maxWidth: '1440px', margin: '0 auto', width: '100%', textAlign: 'center', marginTop: '10vh' }}>
      <h1 className="text-h1" style={{ fontSize: '4rem', color: 'var(--color-primary)' }}>404</h1>
      <h2 className="text-h2" style={{ marginTop: 'var(--space-md)' }}>Page Not Found</h2>
      <p className="text-body-md" style={{ marginTop: 'var(--space-sm)', color: 'var(--color-on-surface-variant)' }}>
        The page you are looking for doesn't exist or has been moved.
      </p>
      <div style={{ marginTop: 'var(--space-xl)' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Button variant="primary">Return Home</Button>
        </Link>
      </div>
    </div>
  )
}
