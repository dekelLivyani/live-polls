import { Link } from 'react-router-dom'
import { useAuth } from '@/context'

export default function HomePage() {
  const { user } = useAuth()

  return (
    <div className="home-hero">
      <h1 className="home-title">
        Create polls.<br />Collect votes. Instantly.
      </h1>
      <p className="home-subtitle">
        Share a link, let anyone vote, see results in real time.
      </p>

      {user ? (
        <div className="home-cta">
          <Link to="/create" className="btn-primary-lg">
            + Create a poll
          </Link>
        </div>
      ) : (
        <div className="home-cta">
          <Link to="/register" className="btn-primary-lg">
            Get started — it's free
          </Link>
          <Link to="/login" className="btn-ghost-lg">
            Log in
          </Link>
        </div>
      )}
    </div>
  )
}
