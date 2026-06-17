import { createContext, useContext, useState, useEffect } from 'react'
import { useAccounts } from '../hooks/useAccounts'

const STORAGE_KEY = 'compass_currency'

const CURRENCY_LABELS = {
  ILS: '₪ ILS — Israeli Shekel',
  USD: '$ USD — US Dollar',
  EUR: '€ EUR — Euro',
  GBP: '£ GBP — British Pound',
}

export const SUPPORTED_CURRENCIES = Object.keys(CURRENCY_LABELS)
export { CURRENCY_LABELS }

const CurrencyContext = createContext({ currency: 'ILS', setCurrency: () => {}, formatAmount: (n) => String(n) })

export function CurrencyProvider({ children }) {
  const { accounts } = useAccounts()
  const [currency, setCurrencyState] = useState(() => localStorage.getItem(STORAGE_KEY) || null)

  // Derive from accounts if not overridden
  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY) && accounts.length > 0) {
      const counts = accounts.reduce((acc, a) => {
        if (a.currency) acc[a.currency] = (acc[a.currency] || 0) + 1
        return acc
      }, {})
      const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0]
      if (dominant) setCurrencyState(dominant)
    }
  }, [accounts])

  function setCurrency(code) {
    localStorage.setItem(STORAGE_KEY, code)
    setCurrencyState(code)
  }

  const effectiveCurrency = currency || 'ILS'

  function formatAmount(value, overrideCurrency) {
    const code = overrideCurrency || effectiveCurrency
    return new Intl.NumberFormat('he-IL', { style: 'currency', currency: code, maximumFractionDigits: 2 }).format(value)
  }

  return (
    <CurrencyContext.Provider value={{ currency: effectiveCurrency, setCurrency, formatAmount, CURRENCY_LABELS }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  return useContext(CurrencyContext)
}
