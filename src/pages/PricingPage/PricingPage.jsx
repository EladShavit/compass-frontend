import { Link } from 'react-router-dom'
import Button from '../../components/Button/Button'
import { useLanguage } from '../../context/LanguageContext'
import styles from './PricingPage.module.css'

export default function PricingPage() {
  const { t } = useLanguage()

  const TIERS = [
    {
      name: t('pricing_free_name'),
      price: '₪0',
      period: t('pricing_period_month'),
      featured: false,
      features: [
        t('pricing_free_feature_1'),
        t('pricing_free_feature_2'),
        t('pricing_free_feature_3'),
        t('pricing_free_feature_4'),
      ],
      cta: t('pricing_free_cta'),
      ctaLink: '/register',
      ctaVariant: 'secondary',
    },
    {
      name: t('pricing_pro_name'),
      price: '₪39.90',
      period: t('pricing_period_month'),
      featured: true,
      features: [
        t('pricing_pro_feature_1'),
        t('pricing_pro_feature_2'),
        t('pricing_pro_feature_3'),
        t('pricing_pro_feature_4'),
        t('pricing_pro_feature_5'),
      ],
      cta: t('pricing_pro_cta'),
      ctaLink: '/register',
      ctaVariant: 'primary',
    },
  ]

  const FAQS = [
    { q: t('pricing_faq_q1'), a: t('pricing_faq_a1') },
    { q: t('pricing_faq_q2'), a: t('pricing_faq_a2') },
    { q: t('pricing_faq_q3'), a: t('pricing_faq_a3') },
  ]

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className="text-h1">{t('pricing_title')}</h1>
        <p className={`text-body-md ${styles.subtitle}`}>
          {t('pricing_subtitle')}
        </p>
      </div>

      <div className={styles.grid}>
        {TIERS.map((tier) => (
          <div key={tier.name} className={`${styles.card} ${tier.featured ? styles.cardFeatured : ''}`}>
            <div>
              <div className={styles.cardHeader}>
                <h2 className={`text-h2 ${styles.tierName}`}>{tier.name}</h2>
                {tier.featured && <span className={styles.badge}>{t('pricing_most_popular')}</span>}
              </div>
              <div className={styles.price}>
                <span className={styles.priceAmount}>{tier.price}</span>
                <span className={`text-body-md ${styles.pricePeriod}`}>{tier.period}</span>
              </div>
            </div>

            <ul className={styles.featureList}>
              {tier.features.map((f) => (
                <li key={f} className={styles.featureItem}>
                  <span className={`material-symbols-outlined ${styles.featureIcon}`}>check_circle</span>
                  <span className="text-body-md">{f}</span>
                </li>
              ))}
            </ul>

            <Link to={tier.ctaLink} style={{ textDecoration: 'none' }}>
              <Button variant={tier.ctaVariant} size="lg" fullWidth>
                {tier.cta}
              </Button>
            </Link>
          </div>
        ))}
      </div>

      <div className={styles.faq}>
        <h2 className="text-h2">{t('pricing_faq_title')}</h2>
        {FAQS.map((item) => (
          <div key={item.q} className={styles.faqItem}>
            <h3 className={`text-h3 ${styles.faqQuestion}`}>{item.q}</h3>
            <p className={`text-body-md ${styles.faqAnswer}`}>{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
