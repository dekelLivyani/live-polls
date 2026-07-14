export interface AuthUser {
  id: number
  email: string
  firstName: string
  lastName: string
}

export interface AuthState {
  user: AuthUser | null
  accessToken: string | null
}

export interface AuthContextValue extends AuthState {
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    verifyPassword: string,
  ) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: AuthUser
}
