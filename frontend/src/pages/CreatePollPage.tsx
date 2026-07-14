import { useAuth } from '@/context'
import { useNavigate } from 'react-router-dom'
import { useCreatePoll } from '@/hooks'
import { FormCard } from '@/components/shared/FormCard'
import { OptionsEditor } from '@/components/poll/OptionsEditor'

export default function CreatePollPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { question, setQuestion, options, error, loading, updateOption, addOption, removeOption, handleSubmit } =
    useCreatePoll()

  // redirect if not logged in
  if (!user) {
    navigate('/login')
    return null
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

        <OptionsEditor
          options={options}
          onUpdate={updateOption}
          onAdd={addOption}
          onRemove={removeOption}
        />

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create poll'}
        </button>
      </form>
    </FormCard>
  )
}
