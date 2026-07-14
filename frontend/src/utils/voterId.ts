const VOTER_ID_KEY = 'voterId'

/**
 * Returns a persistent anonymous voter id.
 * Generated once via crypto.randomUUID() and stored in localStorage.
 */
export function getVoterId(): string {
  const stored = localStorage.getItem(VOTER_ID_KEY)
  if (stored) return stored

  const id = crypto.randomUUID()
  localStorage.setItem(VOTER_ID_KEY, id)
  return id
}
