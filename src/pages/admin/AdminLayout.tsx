import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const ADMIN_SESSION_KEY = 'nasal_admin_logged_in'

const navItems = [
  { label: 'Overview', path: '/admin' },
  { label: 'Projects', path: '/admin/projects' },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const loggedIn = sessionStorage.getItem(ADMIN_SESSION_KEY)

    if (loggedIn !== 'true') {
      navigate('/admin/login', { replace: true })
    }
  }, [navigate])

  function handleLogout() {
    sessionStorage.removeItem(ADMIN_SESSION_KEY)
    navigate('/admin/login', { replace: true })
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0d0c0e',
        fontFamily: "'Work Sans', sans-serif",
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top bar */}
      <header
        style={{
          backgroundColor: '#131113',
          borderBottom: '1px solid #2a2630',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.5rem',
          height: 56,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
          }}
        >
          <Link
            to="/"
            style={{
              display: 'flex',
              flexDirection: 'column',
              textDecoration: 'none',
            }}
          >
            <span
              style={{
                fontFamily: "'Fraunces', serif",
                fontWeight: 600,
                fontSize: '0.85rem',
                letterSpacing: '0.06em',
                color: '#f2ede6',
                lineHeight: 1,
              }}
            >
              NHL
            </span>

            <span
              style={{
                fontSize: '0.5rem',
                letterSpacing: '0.24em',
                color: '#c49a26',
                marginTop: 2,
              }}
            >
              ADMIN
            </span>
          </Link>

          <nav
            style={{
              display: 'flex',
              gap: '0.25rem',
            }}
          >
            {navItems.map(item => {
              const active = location.pathname === item.path

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    padding: '0.4rem 0.85rem',
                    fontSize: '0.78rem',
                    textDecoration: 'none',
                    color: active ? '#f2ede6' : '#8a8489',
                    backgroundColor: active
                      ? '#1d1b1e'
                      : 'transparent',
                    borderRadius: 4,
                    transition: 'all 0.15s',
                    fontWeight: active ? 500 : 400,
                  }}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          style={{
            background: 'none',
            border: '1px solid #2a2630',
            cursor: 'pointer',
            color: '#8a8489',
            fontSize: '0.75rem',
            padding: '0.4rem 1rem',
            fontFamily: "'Work Sans', sans-serif",
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#c49a26'
            e.currentTarget.style.color = '#f2ede6'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = '#2a2630'
            e.currentTarget.style.color = '#8a8489'
          }}
        >
          Logout
        </button>
      </header>

      {/* Content */}
      <main
        style={{
          flex: 1,
          padding: '2rem',
          maxWidth: 1200,
          width: '100%',
          margin: '0 auto',
          boxSizing: 'border-box',
        }}
      >
        {children}
      </main>
    </div>
  )
}