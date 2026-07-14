import { useLoginForm } from '@/hooks'
import { LoginForm } from '@/components/auth/LoginForm'

export default function LoginPage() {
  const { fields, setters, error, loading, handleSubmit } = useLoginForm()

  return (
    <LoginForm
      fields={fields}
      setters={setters}
      error={error}
      loading={loading}
      onSubmit={handleSubmit}
    />
  )
}
