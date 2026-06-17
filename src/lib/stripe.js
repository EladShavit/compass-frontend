import { supabase } from './supabase'

export async function redirectToCheckout() {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Not authenticated')

  const { data, error } = await supabase.functions.invoke('create-checkout-session', {
    body: { origin: window.location.origin },
    headers: { Authorization: `Bearer ${session.access_token}` },
  })

  if (error) throw new Error(error.message)
  if (!data?.url) throw new Error('No checkout URL returned')

  window.location.href = data.url
}
