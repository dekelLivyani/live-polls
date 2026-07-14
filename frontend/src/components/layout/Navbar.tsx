import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '@/context'

export function Navbar() {
  const { user, logout } = useAuth()

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          Live Polls
        </Link>

        <nav className="navbar-links">
          {user ? (
            <>
              <NavLink to="/create" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Create poll
              </NavLink>
              <span className="navbar-greeting">Hello, {user.firstName}!</span>
              <button className="nav-btn-ghost" onClick={logout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Log in
              </NavLink>
              <NavLink to="/register" className="nav-btn-primary">
                Register
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
