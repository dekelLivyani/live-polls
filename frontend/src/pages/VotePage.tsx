import { usePollVote } from '@/hooks'
import { VoteOptionsList } from '@/components/poll/VoteOptionsList'
import { ResultsList } from '@/components/poll/ResultsList'
import { VotePhase } from '@/types'

export default function VotePage() {
  const { state, vote, refresh } = usePollVote()

  if (state.phase === VotePhase.Loading) {
    return <PageWrap><p style={{ color: '#94a3b8' }}>Loading poll…</p></PageWrap>
  }

  if (state.phase === VotePhase.Error) {
    return (
      <PageWrap>
        <div className="card">
          <p style={{ color: '#f87171' }}>{state.message}</p>
        </div>
      </PageWrap>
    )
  }

  if (state.phase === VotePhase.Voting) {
    return (
      <PageWrap>
        <div className="card">
          <h2 style={{ marginBottom: '1.5rem' }}>{state.poll.question}</h2>
          <VoteOptionsList options={state.poll.options} onVote={vote} />
          {state.voteError && (
            <p className="error" style={{ marginTop: '1rem' }}>{state.voteError}</p>
          )}
        </div>
      </PageWrap>
    )
  }

  // VotePhase.Results
  const { results, justVoted } = state
  const totalVotes = results.options.reduce((sum, o) => sum + o.votes, 0)

  return (
    <PageWrap>
      <div className="card">
        <h2 style={{ marginBottom: '0.5rem' }}>{results.question}</h2>

        {justVoted ? (
          <p style={{ color: '#22c55e', fontSize: '0.875rem', marginBottom: '1rem' }}>
            ✓ Your vote was counted!
          </p>
        ) : (
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1rem' }}>
            You have already voted on this poll.
          </p>
        )}

        <ResultsList options={results.options} totalVotes={totalVotes} />

        <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '1rem' }}>
          Results don't update live yet — click refresh to see latest counts.
        </p>

        <button onClick={refresh} className="secondary" style={{ width: '100%' }}>
          ↻ Refresh results
        </button>
      </div>
    </PageWrap>
  )
}

function PageWrap({ children }: { children: React.ReactNode }) {
  return <main style={{ width: '100%', maxWidth: '560px', margin: '0 auto' }}>{children}</main>
}
