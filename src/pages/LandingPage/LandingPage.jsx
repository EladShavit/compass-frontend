import { Link } from 'react-router-dom'
import Button from '../../components/Button/Button'
import { useLanguage } from '../../context/LanguageContext'

export default function LandingPage() {
  const { t } = useLanguage()
  return (
    <div style={{ padding: 'var(--space-xl)', maxWidth: '1440px', margin: '0 auto', width: '100%', textAlign: 'center', marginTop: '10vh' }}>
      <h1 className="text-h1" style={{ fontSize: '3rem' }}>{t('landing_title')}</h1>
      <p className="text-body-md" style={{ marginTop: 'var(--space-md)', color: 'var(--color-on-surface-variant)' }}>
        {t('landing_subtitle')}
      </p>
      <div style={{ marginTop: 'var(--space-xl)', display: 'flex', gap: 'var(--space-md)', justifyContent: 'center' }}>
        <Link to="/register" style={{ textDecoration: 'none' }}>
          <Button variant="primary" size="lg" icon="arrow_forward" iconPosition="right">{t('landing_get_started')}</Button>
        </Link>
        <Link to="/login" style={{ textDecoration: 'none' }}>
          <Button variant="secondary" size="lg" icon="login" iconPosition="left">{t('landing_login')}</Button>
        </Link>
      </div>
    </div>
  )
}
