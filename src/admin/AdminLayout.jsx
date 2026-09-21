import React from 'react'
import { Navigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const NAV_ITEMS = [
  { section: 'Portfolio', items: [
    { label: '👤 Profile', path: '/admin/profile' },
    { label: '📁 Projects', path: '/admin/projects' },
    { label: '💼 Experience', path: '/admin/experience' },
    { label: '🎯 Skills', path: '/admin/skills' },
    { label: '🎓 Education', path: '/admin/education' },
    { label: '📜 Certifications', path: '/admin/certifications' },
  ]},
  { section: 'Settings', items: [
    { label: '⚙️ Settings', path: '/admin/settings' },
  ]},
]

export default function AdminLayout({ children }) {
  const { session, loading, signOut, user } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--bg-base)' }}>
        <div className="spinner" />
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar" aria-label="Admin navigation">
        <div className="admin-sidebar-logo">
          <h2>Portfolio CMS</h2>
          <p>{user?.email}</p>
        </div>

        <nav className="admin-nav" aria-label="Admin menu">
          {NAV_ITEMS.map(({ section, items }) => (
            <div key={section} style={{ width: '100%' }}>
              <div className="admin-nav-section">{section}</div>
              {items.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
                  aria-current={location.pathname === item.path ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ))}

          <div style={{ marginTop: 'auto', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-subtle)', width: '100%' }}>
            <Link
              to="/"
              target="_blank"
              className="admin-nav-item"
              aria-label="View live portfolio in new tab"
            >
              🌐 View Portfolio ↗
            </Link>
            <button
              className="admin-nav-item"
              onClick={signOut}
              aria-label="Sign out"
              style={{ width: '100%' }}
            >
              🚪 Sign Out
            </button>
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <main className="admin-main" id="admin-main-content">
        {children}
      </main>
    </div>
  )
}
