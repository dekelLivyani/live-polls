import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../api/client'
import { FormCard } from '../components/FormCard'

type CreatePollResponse = { id: number; question: string }

export default function CreatePollPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState(['', ''])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // redirect if not logged in
  if (!user) {
    navigate('/login')
    return null
  }

  function updateOption(index: number, value: string) {
    setOptions((prev) => prev.map((o, i) => (i === index ? value : o)))
  }

  function addOption() {
    setOptions((prev) => [...prev, ''])
  }

  function removeOption(index: number) {
    if (options.length <= 2) return
    setOptions((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    const trimmedOptions = options.map((o) => o.trim()).filter(Boolean)
    if (trimmedOptions.length < 2) {
      setError('Please add at least 2 answer options')
      return
    }

    setLoading(true)
    try {
      const poll = await api.post<CreatePollResponse>('/polls', {
        question: question.trim(),
        options: trimmedOptions,
      })
      navigate(`/polls/${poll.id}/created`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create poll')
    } finally {
      setLoading(false)
    }
  }

  return (
    <FormCard title="Create a new poll">
      <form onSubmit={handleSubmit}>
        <label>Question</label>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="What do you want to ask?"
          required
        />

        <label>Answer options</label>
        {options.map((opt, i) => (
          <div key={i} className="option-row">
            <input
              type="text"
              value={opt}
              onChange={(e) => updateOption(i, e.target.value)}
              placeholder={`Option ${i + 1}`}
            />
            {options.length > 2 && (
              <button
                type="button"
                className="remove-btn"
                onClick={() => removeOption(i)}
              >
                ✕
              </button>
            )}
          </div>
        ))}

        <button type="button" className="secondary" onClick={addOption}>
          + Add option
        </button>

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create poll'}
        </button>
      </form>
    </FormCard>
  )
}
