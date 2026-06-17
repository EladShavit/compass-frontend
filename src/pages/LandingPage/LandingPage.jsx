import { Link, Navigate } from 'react-router-dom'
import Button from '../../components/Button/Button'
import { useLanguage } from '../../context/LanguageContext'
import { useAuth } from '../../context/AuthContext'
import styles from './LandingPage.module.css'

export default function LandingPage() {
  const { t } = useLanguage()
  const { session, loading } = useAuth()

  if (!loading && session) return <Navigate to="/dashboard" replace />

  const HOW_STEPS = [
    { icon: 'upload_file', title: t('landing_how_1_title'), body: t('landing_how_1_body') },
    { icon: 'auto_awesome', title: t('landing_how_2_title'), body: t('landing_how_2_body') },
    { icon: 'insights', title: t('landing_how_3_title'), body: t('landing_how_3_body') },
  ]

  const FEATURES = [
    { icon: 'dashboard', title: t('landing_feat_1_title'), body: t('landing_feat_1_body') },
    { icon: 'notifications_active', title: t('landing_feat_2_title'), body: t('landing_feat_2_body') },
    { icon: 'psychology', title: t('landing_feat_3_title'), body: t('landing_feat_3_body') },
  ]

  const FREE_FEATURES = [
    t('landing_pricing_free_f1'),
    t('landing_pricing_free_f2'),
    t('landing_pricing_free_f3'),
  ]

  const PRO_FEATURES = [
    t('landing_pricing_pro_f1'),
    t('landing_pricing_pro_f2'),
    t('landing_pricing_pro_f3'),
    t('landing_pricing_pro_f4'),
  ]

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroBadge}>
            <span className={`material-symbols-outlined ${styles.heroBadgeIcon}`}>auto_awesome</span>
            AI-Powered · No Bank Connection
          </div>
          <h1 className={styles.heroTitle}>{t('landing_title')}</h1>
          <p className={styles.heroSubtitle}>{t('landing_subtitle')}</p>
          <div className={styles.heroCtas}>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <Button variant="primary" size="lg" icon="arrow_forward" iconPosition="right">
                {t('landing_get_started')}
              </Button>
            </Link>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Button variant="secondary" size="lg" icon="login" iconPosition="left">
                {t('landing_login')}
              </Button>
            </Link>
          </div>
        </div>
        <div className={styles.heroGlow} />
      </section>

      {/* Stats strip */}
      <section className={styles.statsStrip}>
        <div className={styles.statsInner}>
          {[
            { value: t('landing_stat_1_value'), label: t('landing_stat_1_label') },
            { value: t('landing_stat_2_value'), label: t('landing_stat_2_label') },
            { value: t('landing_stat_3_value'), label: t('landing_stat_3_label') },
          ].map((s) => (
            <div key={s.label} className={styles.stat}>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>{t('landing_how_title')}</h2>
          <div className={styles.stepsGrid}>
            {HOW_STEPS.map((step, i) => (
              <div key={step.title} className={styles.stepCard}>
                <div className={styles.stepNum}>{i + 1}</div>
                <div className={styles.stepIconWrap}>
                  <span className={`material-symbols-outlined ${styles.stepIcon}`}>{step.icon}</span>
                </div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepBody}>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>{t('landing_features_title')}</h2>
          <div className={styles.featuresGrid}>
            {FEATURES.map((f) => (
              <div key={f.title} className={styles.featureCard}>
                <div className={styles.featureIconWrap}>
                  <span className={`material-symbols-outlined ${styles.featureIcon}`}>{f.icon}</span>
                </div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureBody}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>{t('landing_pricing_title')}</h2>
          <div className={styles.pricingGrid}>
            {/* Free */}
            <div className={styles.pricingCard}>
              <div className={styles.pricingName}>{t('landing_pricing_free_name')}</div>
              <div className={styles.pricingPrice}>
                {t('landing_pricing_free_price')}
                <span className={styles.pricingPeriod}>{t('landing_pricing_pro_period')}</span>
              </div>
              <p className={styles.pricingDesc}>{t('landing_pricing_free_desc')}</p>
              <ul className={styles.pricingFeatures}>
                {FREE_FEATURES.map((f) => (
                  <li key={f} className={styles.pricingFeature}>
                    <span className={`material-symbols-outlined ${styles.checkIcon}`}>check_circle</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <Button variant="secondary" size="md" fullWidth>{t('landing_get_started')}</Button>
              </Link>
            </div>

            {/* Pro */}
            <div className={`${styles.pricingCard} ${styles.pricingCardPro}`}>
              <div className={styles.pricingProBadge}>Most Popular</div>
              <div className={styles.pricingName}>{t('landing_pricing_pro_name')}</div>
              <div className={styles.pricingPrice}>
                {t('landing_pricing_pro_price')}
                <span className={styles.pricingPeriod}>{t('landing_pricing_pro_period')}</span>
              </div>
              <p className={styles.pricingDesc}>{t('landing_pricing_pro_desc')}</p>
              <ul className={styles.pricingFeatures}>
                {PRO_FEATURES.map((f) => (
                  <li key={f} className={styles.pricingFeature}>
                    <span className={`material-symbols-outlined ${styles.checkIcon}`}>check_circle</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <Button variant="primary" size="md" fullWidth>{t('landing_get_started')}</Button>
              </Link>
            </div>
          </div>
          <div className={styles.pricingLink}>
            <Link to="/pricing">{t('landing_pricing_see_all')}</Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>{t('landing_cta_title')}</h2>
          <p className={styles.ctaSubtitle}>{t('landing_cta_subtitle')}</p>
          <Link to="/register" style={{ textDecoration: 'none' }}>
            <Button variant="primary" size="lg" icon="arrow_forward" iconPosition="right">
              {t('landing_cta_button')}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
