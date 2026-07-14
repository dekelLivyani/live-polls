import { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { FormCard } from '@/components/shared/FormCard'

type Props = {
  fields: {
    firstName: string
    lastName: string
    email: string
    password: string
    verifyPassword: string
  }
  setters: {
    setFirstName: (v: string) => void
    setLastName: (v: string) => void
    setEmail: (v: string) => void
    setPassword: (v: string) => void
    setVerifyPassword: (v: string) => void
  }
  error: string | null
  loading: boolean
  onSubmit: (e: FormEvent) => void
}

export function RegisterForm({ fields, setters, error, loading, onSubmit }: Props) {
  return (
    <FormCard title="Register">
      <form onSubmit={onSubmit}>
        <label>First name</label>
        <input
          type="text"
          value={fields.firstName}
          onChange={(e) => setters.setFirstName(e.target.value)}
          required
          autoComplete="given-name"
        />
        <label>Last name</label>
        <input
          type="text"
          value={fields.lastName}
          onChange={(e) => setters.setLastName(e.target.value)}
          required
          autoComplete="family-name"
        />
        <label>Email</label>
        <input
          type="email"
          value={fields.email}
          onChange={(e) => setters.setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <label>Password (at least 8 characters)</label>
        <input
          type="password"
          value={fields.password}
          onChange={(e) => setters.setPassword(e.target.value)}
          required
          minLength={8}
          autoComplete="new-password"
        />
        <label>Confirm password</label>
        <input
          type="password"
          value={fields.verifyPassword}
          onChange={(e) => setters.setVerifyPassword(e.target.value)}
          required
          minLength={8}
          autoComplete="new-password"
        />
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <p className="alt-link">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </FormCard>
  )
}
