import { useAuth } from '../context/AuthContext'

const TRIAL_DAYS = 14

export const TIER_LIMITS = {
  Free: {
    maxAccounts: 2,
    maxUploadsPerMonth: 5,
  },
  Pro: {
    maxAccounts: Infinity,
    maxUploadsPerMonth: Infinity,
  },
}

export function useTier() {
  const { profile, user } = useAuth()
  const tier = profile?.tier ?? 'Free'

  // 2-week free trial based on account creation date
  const signedUpAt = user?.created_at ? new Date(user.created_at) : null
  const trialDaysLeft = signedUpAt
    ? Math.max(0, TRIAL_DAYS - Math.floor((Date.now() - signedUpAt.getTime()) / 86400000))
    : 0
  const isTrialing = tier !== 'Pro' && trialDaysLeft > 0

  const isPro = tier === 'Pro' || isTrialing
  const isFree = !isPro
  const limits = isPro ? TIER_LIMITS.Pro : TIER_LIMITS.Free

  return { tier, isPro, isFree, isTrialing, trialDaysLeft, limits }
}
