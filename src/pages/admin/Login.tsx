import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ADMIN_EMAIL = 'admin@nasalholdings.com'
const ADMIN_PASSWORD = 'admin123'
const ADMIN_SESSION_KEY = 'nasal_admin_logged_in'

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
        backgroundColor: '#09080a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Work Sans', sans-serif",
        padding: '1.5rem',
      }}
    >
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Brand */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '2.5rem',
          }}
        >
          <div
            style={{
              fontFamily: "'Fraunces', serif",
              fontWeight: 600,
              fontSize: '1.2rem',
              letterSpacing: '0.08em',
              color: '#f2ede6',
            }}
          >
            NASAL HOLDINGS
          </div>

          <div
            style={{
              fontSize: '0.58rem',
              letterSpacing: '0.32em',
              color: '#c49a26',
              marginTop: 3,
            }}
          >
            LIMITED — ADMIN
          </div>
        </div>

        {/* Login card */}
        <div
          style={{
            backgroundColor: '#131113',
            border: '1px solid #2a2630',
            padding: '2.5rem',
          }}
        >
          <h1
            style={{
              fontFamily: "'Fraunces', serif",
              fontWeight: 300,
              fontSize: '1.6rem',
              color: '#f2ede6',
              margin: '0 0 0.5rem',
            }}
          >
            Sign in
          </h1>

          <p
            style={{
              color: '#8a8489',
              fontSize: '0.85rem',
              margin: '0 0 2rem',
            }}
          >
            Access the admin panel
          </p>

          {error && (
            <div
              style={{
                backgroundColor: '#1e0a0a',
                border: '1px solid #5c1a1a',
                color: '#f87171',
                padding: '0.75rem 1rem',
                fontSize: '0.82rem',
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
              gap: '1.1rem',
            }}
          >
            {/* Email */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
              }}
            >
              <label
                htmlFor="email"
                style={{
                  fontSize: '0.62rem',
                  letterSpacing: '0.2em',
                  color: '#c49a26',
                  textTransform: 'uppercase',
                }}
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                placeholder="admin@nasalholdings.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={loading}
                autoComplete="username"
                style={{
                  backgroundColor: '#09080a',
                  border: '1px solid #2a2630',
                  color: '#f2ede6',
                  padding: '0.85rem 1rem',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  fontFamily: "'Work Sans', sans-serif",
                  width: '100%',
                  boxSizing: 'border-box',
                }}
                onFocus={e => {
                  e.target.style.borderColor = '#c49a26'
                }}
                onBlur={e => {
                  e.target.style.borderColor = '#2a2630'
                }}
              />
            </div>

            {/* Password */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
              }}
            >
              <label
                htmlFor="password"
                style={{
                  fontSize: '0.62rem',
                  letterSpacing: '0.2em',
                  color: '#c49a26',
                  textTransform: 'uppercase',
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
                    backgroundColor: '#09080a',
                    border: '1px solid #2a2630',
                    color: '#f2ede6',
                    padding: '0.85rem 3rem 0.85rem 1rem',
                    fontSize: '0.9rem',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    fontFamily: "'Work Sans', sans-serif",
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = '#c49a26'
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = '#2a2630'
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
                    color: '#8a8489',
                    fontSize: '0.8rem',
                    padding: 0,
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
                backgroundColor: loading ? '#8a6b1c' : '#c49a26',
                color: '#09080a',
                padding: '1rem',
                fontSize: '0.78rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontWeight: 600,
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '0.5rem',
                transition: 'background-color 0.2s',
                fontFamily: "'Work Sans', sans-serif",
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        {/* Back to website */}
        <p
          style={{
            textAlign: 'center',
            marginTop: '1.5rem',
            fontSize: '0.75rem',
            color: '#3a3538',
          }}
        >
          <a
            href="/"
            style={{
              color: '#3a3538',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#8a8489'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#3a3538'
            }}
          >
            ← Back to website
          </a>
        </p>
      </div>
    </div>
  )
}