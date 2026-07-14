import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '@/api'
import { useAuth } from '@/context'
import { getVoterId } from '@/utils'
import { VotePhase } from '@/types'
import type { Poll, PollResults, VotePagePhase } from '@/types'

export function usePollVote() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const [state, setState] = useState<VotePagePhase>({ phase: VotePhase.Loading })

  // use userId if logged in, otherwise fall back to anonymous UUID
  const voterId = user ? String(user.id) : getVoterId()

  useEffect(() => {
    api
      .get<Poll>(`/polls/${id}`)
      .then((poll) => setState({ phase: VotePhase.Voting, poll }))
      .catch((err) =>
        setState({
          phase: VotePhase.Error,
          message: err instanceof Error ? err.message : 'Failed to load poll',
        }),
      )
  }, [id])

  async function fetchResults(): Promise<PollResults> {
    return api.get<PollResults>(`/polls/${id}/results`)
  }

  async function vote(optionId: number) {
    // clear any previous vote error before trying again
    setState((prev) => prev.phase === VotePhase.Voting ? { ...prev, voteError: undefined } : prev)

    try {
      await api.post(`/polls/${id}/vote`, { optionId, voterId }, { skipAuth: true })
      const results = await fetchResults()
      setState({ phase: VotePhase.Results, results, justVoted: true })
    } catch (err) {
      // 409 = already voted — show results anyway
      if (err instanceof Error && err.message.startsWith('409')) {
        const results = await fetchResults()
        setState({ phase: VotePhase.Results, results, justVoted: false })
        return
      }
      // any other error: stay on voting phase, show error inline
      setState((prev) =>
        prev.phase === VotePhase.Voting
          ? { ...prev, voteError: err instanceof Error ? err.message : 'Failed to vote' }
          : prev,
      )
    }
  }

  async function refresh() {
    try {
      const results = await fetchResults()
      setState((prev) =>
        prev.phase === VotePhase.Results ? { ...prev, results } : prev,
      )
    } catch (err) {
      setState({
        phase: VotePhase.Error,
        message: err instanceof Error ? err.message : 'Failed to refresh',
      })
    }
  }

  return { state, vote, refresh }
}
