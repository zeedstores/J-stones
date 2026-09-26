import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import logo from '../../imports/logo.png'

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
const loggedIn = window.sessionStorage.getItem(ADMIN_SESSION_KEY)


if (loggedIn !== 'true') {
  navigate('/admin/login', { replace: true })
}


}, [navigate])

function handleLogout() {
window.sessionStorage.removeItem(ADMIN_SESSION_KEY)
navigate('/admin/login', { replace: true })
}

return (
<div
style={{
minHeight: '100vh',
backgroundColor: '#F5F3EE',
color: '#101820',
fontFamily: "'DM Sans', sans-serif",
display: 'flex',
flexDirection: 'column',
}}
>
<header
style={{
backgroundColor: '#0B3768',
color: '#FFFFFF',
borderBottom: '1px solid rgba(255,255,255,0.12)',
display: 'flex',
alignItems: 'center',
justifyContent: 'space-between',
padding: '0 2rem',
height: 72,
flexShrink: 0,
}}
>
<div
style={{
display: 'flex',
alignItems: 'center',
gap: '3rem',
}}
>
<Link
to="/"
style={{
display: 'flex',
alignItems: 'center',
gap: '0.75rem',
textDecoration: 'none',
color: '#FFFFFF',
}}
>
<img
src={logo}
alt="J-STONES Construction Company Limited"
style={{
width: 38,
height: 38,
objectFit: 'contain',
}}
/>


        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <strong
            style={{
              fontSize: '0.78rem',
              letterSpacing: '0.08em',
              lineHeight: 1.1,
              fontWeight: 600,
            }}
          >
            J-STONES
          </strong>

          <span
            style={{
              fontSize: '0.5rem',
              letterSpacing: '0.22em',
              color: '#D97924',
              marginTop: 4,
            }}
          >
            CONSTRUCTION
          </span>
        </div>
      </Link>

      <div
        style={{
          width: 1,
          height: 28,
          backgroundColor: 'rgba(255,255,255,0.18)',
        }}
      />

      <nav
        style={{
          display: 'flex',
          gap: '0.35rem',
        }}
      >
        {navItems.map(item => {
          const active = location.pathname === item.path

          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                padding: '0.55rem 1rem',
                fontSize: '0.78rem',
                textDecoration: 'none',
                color: active
                  ? '#101820'
                  : 'rgba(255,255,255,0.7)',
                backgroundColor: active
                  ? '#F5F3EE'
                  : 'transparent',
                borderRadius: 2,
                transition: 'all 0.2s ease',
                fontWeight: active ? 600 : 400,
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
        background: 'transparent',
        border: '1px solid rgba(255,255,255,0.25)',
        cursor: 'pointer',
        color: 'rgba(255,255,255,0.75)',
        fontSize: '0.72rem',
        padding: '0.55rem 1rem',
        fontFamily: "'DM Sans', sans-serif",
        letterSpacing: '0.04em',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = '#D97924'
        e.currentTarget.style.color = '#FFFFFF'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor =
          'rgba(255,255,255,0.25)'
        e.currentTarget.style.color =
          'rgba(255,255,255,0.75)'
      }}
    >
      Logout
    </button>
  </header>

  <main
    style={{
      flex: 1,
      padding: '3rem 2rem',
      maxWidth: 1280,
      width: '100%',
      margin: '0 auto',
      boxSizing: 'border-box',
    }}
  >
    {children}
  </main>

  <footer
    style={{
      padding: '1.25rem 2rem',
      borderTop: '1px solid #C7CED6',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: '#66717C',
      fontSize: '0.68rem',
      letterSpacing: '0.04em',
    }}
  >
    <span>
      J-STONES Construction Company Limited
    </span>

    <span>
      Admin Portal
    </span>
  </footer>
</div>
)
}
