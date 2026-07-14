import { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { FormCard } from '@/components/shared/FormCard'

type Props = {
  fields: { email: string; password: string }
  setters: { setEmail: (v: string) => void; setPassword: (v: string) => void }
  error: string | null
  loading: boolean
  onSubmit: (e: FormEvent) => void
}

export function LoginForm({ fields, setters, error, loading, onSubmit }: Props) {
  return (
    <FormCard title="Log in">
      <form onSubmit={onSubmit}>
        <label>Email</label>
        <input
          type="email"
          value={fields.email}
          onChange={(e) => setters.setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <label>Password</label>
        <input
          type="password"
          value={fields.password}
          onChange={(e) => setters.setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Log in'}
        </button>
      </form>
      <p className="alt-link">
        No account yet? <Link to="/register">Register</Link>
      </p>
    </FormCard>
  )
}
