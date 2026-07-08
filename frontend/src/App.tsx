import { useEffect, useState } from 'react'

const BACKEND_URL = 'http://localhost:3000'

type HealthStatus = {
  status: string
  postgres: string
  redis: string
  timestamp: string
}

type FetchState =
  | { phase: 'loading' }
  | { phase: 'ok'; data: HealthStatus }
  | { phase: 'error'; message: string }

export default function App() {
  const [state, setState] = useState<FetchState>({ phase: 'loading' })

  useEffect(() => {
    fetch(`${BACKEND_URL}/health`)
      .then((res) => {
        if (!res.ok) {
          return res.json().then((body) => {
            throw new Error(
              `${res.status} ${res.statusText} — ${JSON.stringify(body)}`,
            )
          })
        }
        return res.json() as Promise<HealthStatus>
      })
      .then((data) => setState({ phase: 'ok', data }))
      .catch((err: unknown) =>
        setState({
          phase: 'error',
          message: err instanceof Error ? err.message : String(err),
        }),
      )
  }, [])

  return (
    <main>
      <h1 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>
        🗳️ Live Polls — Health Check
      </h1>

      {state.phase === 'loading' && (
        <p style={{ color: '#94a3b8' }}>Contacting backend…</p>
      )}

      {state.phase === 'ok' && (
        <div>
          <StatusRow label="Overall" value={state.data.status} />
          <StatusRow label="Postgres" value={state.data.postgres} />
          <StatusRow label="Redis" value={state.data.redis} />
          <p style={{ marginTop: '1rem', color: '#64748b', fontSize: '0.8rem' }}>
            {state.data.timestamp}
          </p>
          <details style={{ marginTop: '1.5rem' }}>
            <summary style={{ cursor: 'pointer', color: '#94a3b8' }}>
              Raw JSON
            </summary>
            <pre
              style={{
                marginTop: '0.5rem',
                padding: '1rem',
                background: '#1e293b',
                borderRadius: '8px',
                fontSize: '0.85rem',
                overflow: 'auto',
              }}
            >
              {JSON.stringify(state.data, null, 2)}
            </pre>
          </details>
        </div>
      )}

      {state.phase === 'error' && (
        <div
          style={{
            padding: '1rem',
            background: '#450a0a',
            border: '1px solid #991b1b',
            borderRadius: '8px',
            color: '#fca5a5',
          }}
        >
          <strong>Backend unreachable</strong>
          <pre style={{ marginTop: '0.5rem', fontSize: '0.85rem', whiteSpace: 'pre-wrap' }}>
            {state.message}
          </pre>
        </div>
      )}
    </main>
  )
}

function StatusRow({ label, value }: { label: string; value: string }) {
  const isOk = value === 'ok' || value === 'up'
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0.6rem 1rem',
        marginBottom: '0.5rem',
        background: '#1e293b',
        borderRadius: '8px',
        borderLeft: `4px solid ${isOk ? '#22c55e' : '#ef4444'}`,
      }}
    >
      <span style={{ color: '#94a3b8' }}>{label}</span>
      <span
        style={{
          fontWeight: 600,
          color: isOk ? '#22c55e' : '#ef4444',
        }}
      >
        {value}
      </span>
    </div>
  )
}
