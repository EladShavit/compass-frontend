import { useAuth } from '../context/AuthContext'

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
  const { profile } = useAuth()
  const tier = profile?.tier ?? 'Free'
  const isPro = tier === 'Pro'
  const isFree = !isPro
  const limits = TIER_LIMITS[tier] ?? TIER_LIMITS.Free

  return { tier, isPro, isFree, limits }
}
