import { Link } from 'react-router-dom'
import Button from '../../components/Button/Button'

export default function LandingPage() {
  return (
    <div style={{ padding: 'var(--space-xl)', maxWidth: '1440px', margin: '0 auto', width: '100%', textAlign: 'center', marginTop: '10vh' }}>
      <h1 className="text-h1" style={{ fontSize: '3rem' }}>Welcome to Compass</h1>
      <p className="text-body-md" style={{ marginTop: 'var(--space-md)', color: 'var(--color-on-surface-variant)' }}>
        Your automated financial intelligence dashboard.
      </p>
      <div style={{ marginTop: 'var(--space-xl)', display: 'flex', gap: 'var(--space-md)', justifyContent: 'center' }}>
        <Link to="/register" style={{ textDecoration: 'none' }}>
          <Button variant="primary" size="large">Get Started</Button>
        </Link>
        <Link to="/login" style={{ textDecoration: 'none' }}>
          <Button variant="secondary" size="large">Login to Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}
