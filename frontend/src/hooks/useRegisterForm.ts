import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context'

export function useRegisterForm() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [verifyPassword, setVerifyPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== verifyPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      await register(email, password, firstName, lastName, verifyPassword)
      navigate('/create')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed, please try again')
    } finally {
      setLoading(false)
    }
  }

  return {
    fields: { firstName, lastName, email, password, verifyPassword },
    setters: { setFirstName, setLastName, setEmail, setPassword, setVerifyPassword },
    error,
    loading,
    handleSubmit,
  }
}
