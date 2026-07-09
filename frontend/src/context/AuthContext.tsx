import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { api } from '../api/client'

type AuthUser = {
  id: number
  email: string
}

type AuthState = {
  user: AuthUser | null
  accessToken: string | null
}

type AuthContextValue = AuthState & {
  register: (email: string, password: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

type AuthResponse = {
  accessToken: string
  refreshToken: string
  user: AuthUser
}

function loadFromStorage(): AuthState {
  try {
    const token = localStorage.getItem('accessToken')
    const raw = localStorage.getItem('authUser')
    const user: AuthUser | null = raw ? (JSON.parse(raw) as AuthUser) : null
    return { accessToken: token, user }
  } catch {
    return { accessToken: null, user: null }
  }
}

function saveToStorage(token: string, user: AuthUser) {
  localStorage.setItem('accessToken', token)
  localStorage.setItem('authUser', JSON.stringify(user))
}

function clearStorage() {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('authUser')
  localStorage.removeItem('refreshToken')
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(loadFromStorage)

  // keep token in sync so api/client.ts picks it up even on initial render
  useEffect(() => {
    if (state.accessToken)
      localStorage.setItem('accessToken', state.accessToken)
  }, [state.accessToken])

  const register = useCallback(async (email: string, password: string) => {
    const data = await api.post<AuthResponse>(
      '/auth/register',
      { email, password },
      { skipAuth: true },
    )
    localStorage.setItem('refreshToken', data.refreshToken)
    saveToStorage(data.accessToken, data.user)
    setState({ accessToken: data.accessToken, user: data.user })
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const data = await api.post<AuthResponse>(
      '/auth/login',
      { email, password },
      { skipAuth: true },
    )
    localStorage.setItem('refreshToken', data.refreshToken)
    saveToStorage(data.accessToken, data.user)
    setState({ accessToken: data.accessToken, user: data.user })
  }, [])

  const logout = useCallback(() => {
    clearStorage()
    setState({ accessToken: null, user: null })
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
