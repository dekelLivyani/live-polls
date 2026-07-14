import { useRegisterForm } from '@/hooks'
import { RegisterForm } from '@/components/auth/RegisterForm'

export default function RegisterPage() {
  const { fields, setters, error, loading, handleSubmit } = useRegisterForm()

  return (
    <RegisterForm
      fields={fields}
      setters={setters}
      error={error}
      loading={loading}
      onSubmit={handleSubmit}
    />
  )
}
