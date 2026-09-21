import React, { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'

export default function AdminLogin() {
  const { session, signIn, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!loading && session) {
    return <Navigate to="/admin/profile" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please enter your email and password.')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      await signIn(email, password)
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="admin-login">
      <motion.div
        className="admin-login-card"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="admin-login-logo">
          Harshrajsinh<span>.</span>
        </div>
        <p className="admin-login-sub">Portfolio CMS — Admin Access</p>

        <form onSubmit={handleSubmit} className="admin-form" noValidate>
          {error && (
            <div className="alert alert-error" role="alert">{error}</div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              className="form-input"
              placeholder="admin@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: 'var(--space-3)' }}
            disabled={submitting}
            id="login-submit"
          >
            {submitting ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <div className="spinner" style={{ width: 16, height: 16 }} />
                Signing in…
              </span>
            ) : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: 'var(--space-6)', textAlign: 'center' }}>
          <Link to="/" className="text-muted text-body-sm" style={{ textDecoration: 'underline', textUnderlineOffset: '3px' }}>
            ← Back to portfolio
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
