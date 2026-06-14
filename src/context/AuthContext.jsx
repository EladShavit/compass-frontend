import { createContext, useContext, useState, useEffect } from 'react'
import { auth } from '../lib/auth'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Get Session
    auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    }).catch(() => {
      setLoading(false)
    })

    // 2. Listen for Auth Changes
    const { data: { subscription } } = auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId) {
    if (import.meta.env.VITE_USE_MOCK_AUTH === 'true') {
      // Mock Profile
      setProfile({
        user_id: userId,
        email: 'mock@example.com',
        first_name: 'Mock',
        display_name: 'Mock User',
        tier: 'Free'
      })
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single()
      
      if (error) {
        // PostgREST returns PGRST116 if no rows found
        if (error.code !== 'PGRST116') {
          console.error('Error fetching profile:', error)
        }
      } else if (data) {
        setProfile(data)
      }
    } catch (err) {
      console.error('Error fetching profile:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ session, user: session?.user, profile, loading, setProfile, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
