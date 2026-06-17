import { supabase } from './supabase'

const USE_MOCK_AUTH = import.meta.env.VITE_USE_MOCK_AUTH === 'true'

// Mock Auth State Management
const MOCK_SESSION_KEY = 'compass_mock_session'
let mockAuthListeners = []

function getMockSession() {
  const session = localStorage.getItem(MOCK_SESSION_KEY)
  return session ? JSON.parse(session) : null
}

function setMockSession(session) {
  if (session) {
    localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(session))
  } else {
    localStorage.removeItem(MOCK_SESSION_KEY)
  }
  notifyMockListeners(session)
}

function notifyMockListeners(session) {
  mockAuthListeners.forEach((listener) => listener('SIGNED_IN_OR_OUT', session))
}

export const auth = {
  async getSession() {
    if (USE_MOCK_AUTH) {
      return { data: { session: getMockSession() }, error: null }
    }
    return supabase.auth.getSession()
  },

  onAuthStateChange(callback) {
    if (USE_MOCK_AUTH) {
      mockAuthListeners.push(callback)
      return {
        data: {
          subscription: {
            unsubscribe: () => {
              mockAuthListeners = mockAuthListeners.filter((cb) => cb !== callback)
            },
          },
        },
      }
    }
    return supabase.auth.onAuthStateChange(callback)
  },

  async signUp({ email, password, options }) {
    if (USE_MOCK_AUTH) {
      const mockUser = {
        id: 'mock-user-id-' + Date.now(),
        email,
        user_metadata: options?.data || {},
      }
      const session = {
        user: mockUser,
        access_token: 'mock-access-token',
      }
      setMockSession(session)
      return { data: { user: mockUser, session }, error: null }
    }
    return supabase.auth.signUp({ email, password, options })
  },

  async signInWithPassword({ email, password }) {
    if (USE_MOCK_AUTH) {
      const session = {
        user: { id: 'mock-user-id', email },
        access_token: 'mock-access-token',
      }
      setMockSession(session)
      return { data: { session }, error: null }
    }
    return supabase.auth.signInWithPassword({ email, password })
  },

  async signOut() {
    if (USE_MOCK_AUTH) {
      setMockSession(null)
      return { error: null }
    }
    return supabase.auth.signOut()
  },

  async signInWithGoogle() {
    if (USE_MOCK_AUTH) {
      const session = {
        user: { id: 'mock-user-id', email: 'mock-google-user@example.com' },
        access_token: 'mock-access-token',
      }
      setMockSession(session)
      return { data: { session }, error: null }
    }
    return supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    })
  },
}
