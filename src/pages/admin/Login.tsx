import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../imports/logo.png'

const ADMIN_EMAIL = 'admin@jstonesconstruction.com'
const ADMIN_PASSWORD = 'Jstones@admin'
const ADMIN_SESSION_KEY = 'jstones_admin_logged_in'

export default function AdminLogin() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password) {
      setError('Please fill in all fields.')
      return
    }

    setLoading(true)

    setTimeout(() => {
      if (
        email.trim().toLowerCase() === ADMIN_EMAIL &&
        password === ADMIN_PASSWORD
      ) {
        sessionStorage.setItem(ADMIN_SESSION_KEY, 'true')
        navigate('/admin')
        return
      }

      setLoading(false)
      setError('Invalid credentials. Please try again.')
    }, 700)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#F5F3EE',
        color: '#101820',
        fontFamily: "'DM Sans', sans-serif",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.25rem',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 440,
        }}
      >
        {/* Brand */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '2rem',
          }}
        >
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem',
              textDecoration: 'none',
              color: '#101820',
            }}
          >
            <img
              src={logo}
              alt="J-STONES Construction Company Limited"
              style={{
                width: 48,
                height: 48,
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
                  fontSize: '0.85rem',
                  letterSpacing: '0.1em',
                  lineHeight: 1.1,
                  fontWeight: 700,
                }}
              >
                J-STONES
              </strong>

              <span
                style={{
                  fontSize: '0.52rem',
                  letterSpacing: '0.18em',
                  color: '#D97924',
                  marginTop: 5,
                  fontWeight: 700,
                }}
              >
                CONSTRUCTION COMPANY LIMITED
              </span>
            </div>
          </Link>
        </div>

        {/* Login card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #C7CED6',
            padding: '2.5rem',
            boxSizing: 'border-box',
            boxShadow: '0 14px 40px rgba(16, 24, 32, 0.06)',
          }}
        >
          <div
            style={{
              marginBottom: '2rem',
            }}
          >
            <span
              style={{
                display: 'block',
                color: '#D97924',
                fontSize: '0.62rem',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                fontWeight: 700,
                marginBottom: '0.65rem',
              }}
            >
              J-STONES / Admin
            </span>

            <h1
              style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontWeight: 400,
                fontSize: '2rem',
                color: '#101820',
                lineHeight: 1,
                margin: 0,
                letterSpacing: '-0.025em',
              }}
            >
              Sign in
            </h1>

            <p
              style={{
                color: '#66717C',
                fontSize: '0.8rem',
                margin: '0.7rem 0 0',
                lineHeight: 1.6,
              }}
            >
              Access the J-STONES project management panel.
            </p>
          </div>

          {error && (
            <div
              style={{
                backgroundColor: '#F9EEEE',
                border: '1px solid #E2BABA',
                color: '#9B3434',
                padding: '0.75rem 0.9rem',
                fontSize: '0.78rem',
                marginBottom: '1.25rem',
                lineHeight: 1.5,
              }}
            >
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.15rem',
            }}
          >
            {/* Email */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.45rem',
              }}
            >
              <label
                htmlFor="email"
                style={{
                  fontSize: '0.62rem',
                  letterSpacing: '0.15em',
                  color: '#66717C',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                }}
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                placeholder="admin@jstonesconstruction.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={loading}
                autoComplete="username"
                style={{
                  backgroundColor: '#F5F3EE',
                  border: '1px solid #C7CED6',
                  color: '#101820',
                  padding: '0.85rem 0.9rem',
                  fontSize: '0.85rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  fontFamily: "'DM Sans', sans-serif",
                  width: '100%',
                  boxSizing: 'border-box',
                }}
                onFocus={e => {
                  e.target.style.borderColor = '#0B3768'
                }}
                onBlur={e => {
                  e.target.style.borderColor = '#C7CED6'
                }}
              />
            </div>

            {/* Password */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.45rem',
              }}
            >
              <label
                htmlFor="password"
                style={{
                  fontSize: '0.62rem',
                  letterSpacing: '0.15em',
                  color: '#66717C',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                }}
              >
                Password
              </label>

              <div
                style={{
                  position: 'relative',
                }}
              >
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={loading}
                  autoComplete="current-password"
                  style={{
                    backgroundColor: '#F5F3EE',
                    border: '1px solid #C7CED6',
                    color: '#101820',
                    padding: '0.85rem 3.5rem 0.85rem 0.9rem',
                    fontSize: '0.85rem',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    fontFamily: "'DM Sans', sans-serif",
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = '#0B3768'
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = '#C7CED6'
                  }}
                />

                <button
                  type="button"
                  onClick={() => setShowPw(value => !value)}
                  disabled={loading}
                  style={{
                    position: 'absolute',
                    right: '0.85rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: loading ? 'default' : 'pointer',
                    color: '#66717C',
                    fontSize: '0.68rem',
                    padding: 0,
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 700,
                  }}
                >
                  {showPw ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: loading ? '#7890A8' : '#0B3768',
                color: '#FFFFFF',
                padding: '0.95rem',
                fontSize: '0.7rem',
                letterSpacing: '0.11em',
                textTransform: 'uppercase',
                fontWeight: 700,
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '0.35rem',
                transition: 'background-color 0.2s',
                fontFamily: "'DM Sans', sans-serif",
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
              onMouseEnter={e => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#174A7F'
                }
              }}
              onMouseLeave={e => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#0B3768'
                }
              }}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        {/* Back to website */}
        <div
          style={{
            textAlign: 'center',
            marginTop: '1.4rem',
          }}
        >
          <Link
            to="/"
            style={{
              color: '#66717C',
              fontSize: '0.72rem',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#0B3768'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#66717C'
            }}
          >
            ← Back to website
          </Link>
        </div>
      </div>
    </div>
  )
}