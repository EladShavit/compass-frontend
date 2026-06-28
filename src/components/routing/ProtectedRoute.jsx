import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'

export default function ProtectedRoute({ children }) {
  const { session, profile, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-background)' }}>
        <LoadingSpinner />
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Redirect new users to onboarding (skip if already on /onboarding)
  if (profile && profile.onboarding_complete === false && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />
  }

  return children
}
