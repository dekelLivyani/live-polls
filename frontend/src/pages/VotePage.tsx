import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../api/client'
import { getVoterId } from '../utils/voterId'
import { useAuth } from '../context/AuthContext'

type PollOption = {
  id: number
  text: string
}

type Poll = {
  id: number
  question: string
  options: PollOption[]
}

type OptionResult = {
  id: number
  text: string
  votes: number
}

type Results = {
  question: string
  options: OptionResult[]
}

type PageState =
  | { phase: 'loading' }
  | { phase: 'voting'; poll: Poll }
  | { phase: 'results'; results: Results; justVoted: boolean }
  | { phase: 'error'; message: string }

export default function VotePage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const [state, setState] = useState<PageState>({ phase: 'loading' })

  // use userId if logged in, otherwise fall back to anonymous UUID
  const voterId = user ? String(user.id) : getVoterId()

  useEffect(() => {
    api
      .get<Poll>(`/polls/${id}`)
      .then((poll) => setState({ phase: 'voting', poll }))
      .catch((err) =>
        setState({
          phase: 'error',
          message: err instanceof Error ? err.message : 'Failed to load poll',
        }),
      )
  }, [id])

  async function fetchResults() {
    const results = await api.get<Results>(`/polls/${id}/results`)
    return results
  }

  async function handleVote(optionId: number) {
    try {
      await api.post(`/polls/${id}/vote`, { optionId, voterId }, { skipAuth: true })
      const results = await fetchResults()
      setState({ phase: 'results', results, justVoted: true })
    } catch (err) {
      // 409 = already voted — show results anyway
      if (err instanceof Error && err.message.startsWith('409')) {
        const results = await fetchResults()
        setState({ phase: 'results', results, justVoted: false })
        return
      }
      setState({
        phase: 'error',
        message: err instanceof Error ? err.message : 'Failed to vote',
      })
    }
  }

  async function handleRefresh() {
    try {
      const results = await fetchResults()
      setState((prev) =>
        prev.phase === 'results' ? { ...prev, results } : prev,
      )
    } catch (err) {
      setState({
        phase: 'error',
        message: err instanceof Error ? err.message : 'Failed to refresh',
      })
    }
  }

  if (state.phase === 'loading') {
    return <PageWrap><p style={{ color: '#94a3b8' }}>Loading poll…</p></PageWrap>
  }

  if (state.phase === 'error') {
    return (
      <PageWrap>
        <div className="card">
          <p style={{ color: '#f87171' }}>{state.message}</p>
        </div>
      </PageWrap>
    )
  }

  if (state.phase === 'voting') {
    const { poll } = state
    return (
      <PageWrap>
        <div className="card">
          <h2 style={{ marginBottom: '1.5rem' }}>{poll.question}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {poll.options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleVote(opt.id)}
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
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = '#6366f1')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = '#334155')
                }
              >
                {opt.text}
              </button>
            ))}
          </div>
        </div>
      </PageWrap>
    )
  }

  // results phase
  const { results, justVoted } = state
  const totalVotes = results.options.reduce((sum, o) => sum + o.votes, 0)

  return (
    <PageWrap>
      <div className="card">
        <h2 style={{ marginBottom: '0.5rem' }}>{results.question}</h2>

        {justVoted && (
          <p style={{ color: '#22c55e', fontSize: '0.875rem', marginBottom: '1rem' }}>
            ✓ Your vote was counted!
          </p>
        )}

        {!justVoted && (
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1rem' }}>
            You have already voted on this poll.
          </p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          {results.options.map((opt) => {
            const pct = totalVotes === 0 ? 0 : Math.round((opt.votes / totalVotes) * 100)
            return (
              <div key={opt.id}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '0.3rem',
                    fontSize: '0.9rem',
                  }}
                >
                  <span>{opt.text}</span>
                  <span style={{ color: '#94a3b8' }}>
                    {opt.votes} vote{opt.votes !== 1 ? 's' : ''} ({pct}%)
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
          })}
        </div>

        <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '1rem' }}>
          Results don't update live yet — click refresh to see latest counts.
        </p>

        <button
          onClick={handleRefresh}
          className="secondary"
          style={{ width: '100%' }}
        >
          ↻ Refresh results
        </button>
      </div>
    </PageWrap>
  )
}

function PageWrap({ children }: { children: React.ReactNode }) {
  return <main style={{ width: '100%', maxWidth: '560px', margin: '0 auto' }}>{children}</main>
}
