export interface PollOption {
  id: number
  text: string
}

export interface Poll {
  id: number
  question: string
  options: PollOption[]
}

export interface OptionResult {
  id: number
  text: string
  votes: number
}

export interface PollResults {
  question: string
  options: OptionResult[]
}

export interface CreatePollResponse {
  id: number
  question: string
}

export enum VotePhase {
  Loading = 'loading',
  Voting = 'voting',
  Results = 'results',
  Error = 'error',
}

// union → must stay as type
export type VotePagePhase =
  | { phase: VotePhase.Loading }
  | { phase: VotePhase.Voting; poll: Poll; voteError?: string }
  | { phase: VotePhase.Results; results: PollResults; justVoted: boolean }
  | { phase: VotePhase.Error; message: string }  // initial load failure only
