import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '@/api'
import type { CreatePollResponse } from '@/types'

export function useCreatePoll() {
  const navigate = useNavigate()

  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState(['', ''])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

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

  return {
    question,
    setQuestion,
    options,
    error,
    loading,
    updateOption,
    addOption,
    removeOption,
    handleSubmit,
  }
}
