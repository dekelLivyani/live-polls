import type { OptionResult } from '../../types/poll.types'

type Props = {
  options: OptionResult[]
  totalVotes: number
}

export function ResultsList({ options, totalVotes }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
      {options.map((opt) => (
        <ResultBar key={opt.id} option={opt} totalVotes={totalVotes} />
      ))}
    </div>
  )
}

type BarProps = {
  option: OptionResult
  totalVotes: number
}

function ResultBar({ option, totalVotes }: BarProps) {
  const pct = totalVotes === 0 ? 0 : Math.round((option.votes / totalVotes) * 100)

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '0.3rem',
          fontSize: '0.9rem',
        }}
      >
        <span>{option.text}</span>
        <span style={{ color: '#94a3b8' }}>
          {option.votes} vote{option.votes !== 1 ? 's' : ''} ({pct}%)
        </span>
      </div>
      <div
        style={{
          height: '10px',
          background: '#0f172a',
          borderRadius: '999px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: '#6366f1',
            borderRadius: '999px',
            transition: 'width 0.4s ease',
          }}
        />
      </div>
    </div>
  )
}
