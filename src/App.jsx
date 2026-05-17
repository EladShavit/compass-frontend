import { Routes, Route } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout'
import AppLayout from './layouts/AppLayout'
import ProtectedRoute from './components/routing/ProtectedRoute'

// Public Pages
import LandingPage from './pages/LandingPage/LandingPage'
import AboutPage from './pages/AboutPage/AboutPage'
import PricingPage from './pages/PricingPage/PricingPage'
import LoginPage from './pages/LoginPage/LoginPage'
import RegisterPage from './pages/RegisterPage/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage/ForgotPasswordPage'

// Protected Pages
import DashboardPage from './pages/DashboardPage/DashboardPage'
import TransactionsPage from './pages/TransactionsPage/TransactionsPage'
import AlertsPage from './pages/AlertsPage/AlertsPage'
import UploadPage from './pages/UploadPage/UploadPage'
import InsightsPage from './pages/InsightsPage/InsightsPage'
import ProfilePage from './pages/ProfilePage/ProfilePage'
import SettingsPage from './pages/SettingsPage/SettingsPage'

// 404
import NotFoundPage from './pages/NotFoundPage/NotFoundPage'

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* Protected routes */}
      <Route element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      }>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/statements/upload" element={<UploadPage />} />
        <Route path="/upload" element={<UploadPage />} /> {/* Legacy mapping */}
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

