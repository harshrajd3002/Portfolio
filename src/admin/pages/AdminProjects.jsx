import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAllProjectsAdmin } from '../../hooks/useProjects'
import { supabase } from '../../lib/supabase'
import { slugify } from '../../utils/helpers'

export default function AdminProjects() {
  const { projects, loading, refresh } = useAllProjectsAdmin()
  const [deleting, setDeleting] = useState(null)
  const [error, setError] = useState('')

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return
    setDeleting(id)
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id)
      if (error) throw error
      await refresh()
    } catch (err) {
      setError(err.message)
    } finally {
      setDeleting(null)
    }
  }

  const handleTogglePublished = async (project) => {
    try {
      await supabase.from('projects').update({ published: !project.published }).eq('id', project.id)
      await refresh()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleToggleFeatured = async (project) => {
    try {
      await supabase.from('projects').update({ featured: !project.featured }).eq('id', project.id)
      await refresh()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Projects</h1>
          <p className="admin-page-subtitle">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
        </div>
        <Link to="/admin/projects/new" className="btn btn-primary" id="add-project-btn">
          + Add Project
        </Link>
      </div>

      {error && <div className="alert alert-error" style={{ marginBottom: 'var(--space-4)' }} role="alert">{error}</div>}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 'var(--space-16)' }}><div className="spinner" /></div>
      ) : projects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📁</div>
          <div className="empty-state-title">No projects yet</div>
          <div className="empty-state-desc">Add your first case study project.</div>
          <Link to="/admin/projects/new" className="btn btn-primary">Add Project</Link>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Category</th>
                <th>Status</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{p.title}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 2 }}>/{p.slug}</div>
                  </td>
                  <td>
                    <span className="tag">{p.category}</span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleTogglePublished(p)}
                      className={`badge ${p.published ? 'badge-green' : 'badge-gray'}`}
                      style={{ cursor: 'pointer', border: 'none', fontFamily: 'inherit' }}
                      aria-label={`Toggle published status for ${p.title}`}
                    >
                      {p.published ? '● Published' : '○ Draft'}
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => handleToggleFeatured(p)}
                      className={`badge ${p.featured ? 'badge-yellow' : 'badge-gray'}`}
                      style={{ cursor: 'pointer', border: 'none', fontFamily: 'inherit' }}
                      aria-label={`Toggle featured status for ${p.title}`}
                    >
                      {p.featured ? '★ Featured' : '☆ Normal'}
                    </button>
                  </td>
                  <td>
                    <div className="admin-table-actions">
                      <Link
                        to={`/admin/projects/${p.id}`}
                        className="admin-btn-sm"
                        aria-label={`Edit ${p.title}`}
                      >
                        Edit
                      </Link>
                      <Link
                        to={`/projects/${p.slug}`}
                        target="_blank"
                        className="admin-btn-sm"
                        aria-label={`Preview ${p.title}`}
                      >
                        Preview ↗
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id, p.title)}
                        className="admin-btn-sm admin-btn-danger"
                        disabled={deleting === p.id}
                        aria-label={`Delete ${p.title}`}
                      >
                        {deleting === p.id ? '…' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
