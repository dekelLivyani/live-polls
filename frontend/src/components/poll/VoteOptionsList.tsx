import type { PollOption } from '../../types/poll.types'

type Props = {
  options: PollOption[]
  onVote: (optionId: number) => void
}

export function VoteOptionsList({ options, onVote }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {options.map((opt) => (
        <VoteOptionButton key={opt.id} option={opt} onVote={onVote} />
      ))}
    </div>
  )
}

type ButtonProps = {
  option: PollOption
  onVote: (optionId: number) => void
}

function VoteOptionButton({ option, onVote }: ButtonProps) {
  return (
    <button
      onClick={() => onVote(option.id)}
      style={{
        padding: '0.75rem 1rem',
        background: '#0f172a',
        border: '1px solid #334155',
        borderRadius: '8px',
        color: '#e2e8f0',
        fontSize: '1rem',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'border-color 0.15s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#6366f1')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#334155')}
    >
      {option.text}
    </button>
  )
}
