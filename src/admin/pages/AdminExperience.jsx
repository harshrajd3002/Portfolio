import React, { useState } from 'react'
import { useExperience } from '../../hooks/useSupabase'
import { supabase } from '../../lib/supabase'
import { formatDuration } from '../../utils/helpers'

const EMPTY = {
  organization: '', role: '', duration_start: '', duration_end: '',
  is_current: false, location: '', responsibilities: '', key_contribution: '', outcome: '', display_order: 99,
}

export default function AdminExperience() {
  const { data, loading, refresh } = useExperience()
  const [editing, setEditing] = useState(null) // null | 'new' | item
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const startEdit = (item) => {
    setEditing(item)
    if (item === 'new') {
      setForm(EMPTY)
    } else {
      setForm({ ...item, responsibilities: (item.responsibilities || []).join('\n') })
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true); setError('')
    try {
      const payload = {
        ...form,
        responsibilities: form.responsibilities.split('\n').map(s => s.trim()).filter(Boolean),
      }
      if (editing === 'new') {
        const { error } = await supabase.from('experience').insert(payload)
        if (error) throw error
      } else {
        const { error } = await supabase.from('experience').update(payload).eq('id', editing.id)
        if (error) throw error
      }
      await refresh()
      setEditing(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id, role) => {
    if (!window.confirm(`Delete "${role}"?`)) return
    const { error } = await supabase.from('experience').delete().eq('id', id)
    if (!error) refresh()
  }

  if (editing) {
    return (
      <div>
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">{editing === 'new' ? 'Add Experience' : 'Edit Experience'}</h1>
          </div>
          <button className="btn btn-ghost" onClick={() => setEditing(null)}>← Cancel</button>
        </div>
        <form onSubmit={handleSubmit} className="admin-form">
          {error && <div className="alert alert-error" role="alert">{error}</div>}

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="exp-org">Organization *</label>
              <input id="exp-org" type="text" name="organization" className="form-input" value={form.organization} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="exp-role">Role *</label>
              <input id="exp-role" type="text" name="role" className="form-input" value={form.role} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="exp-start">Start Date</label>
              <input id="exp-start" type="date" name="duration_start" className="form-input" value={form.duration_start?.slice(0, 10) || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="exp-end">End Date</label>
              <input id="exp-end" type="date" name="duration_end" className="form-input" value={form.duration_end?.slice(0, 10) || ''} onChange={handleChange} disabled={form.is_current} />
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer' }}>
            <input type="checkbox" name="is_current" checked={form.is_current} onChange={handleChange} />
            <span className="form-label" style={{ marginBottom: 0 }}>Currently working here</span>
          </label>

          <div className="form-group">
            <label className="form-label" htmlFor="exp-location">Location</label>
            <input id="exp-location" type="text" name="location" className="form-input" value={form.location} onChange={handleChange} placeholder="Remote, Ahmedabad…" />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="exp-resp">Responsibilities</label>
            <textarea id="exp-resp" name="responsibilities" className="form-textarea" value={form.responsibilities} onChange={handleChange} placeholder="One responsibility per line" style={{ minHeight: 140 }} />
            <p className="form-hint">One item per line</p>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="exp-key">Key Contribution</label>
            <input id="exp-key" type="text" name="key_contribution" className="form-input" value={form.key_contribution} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="exp-outcome">Outcome / Impact</label>
            <input id="exp-outcome" type="text" name="outcome" className="form-input" value={form.outcome} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="exp-order">Display Order</label>
            <input id="exp-order" type="number" name="display_order" className="form-input" value={form.display_order} onChange={handleChange} style={{ width: 120 }} />
          </div>

          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Experience</h1>
          <p className="admin-page-subtitle">{data.length} position{data.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={() => startEdit('new')} id="add-exp-btn">+ Add Experience</button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 'var(--space-16)' }}><div className="spinner" /></div>
      ) : data.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">💼</div>
          <div className="empty-state-title">No experience yet</div>
          <button className="btn btn-primary" onClick={() => startEdit('new')}>Add First Position</button>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Role</th>
                <th>Organization</th>
                <th>Duration</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map(exp => (
                <tr key={exp.id}>
                  <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                    {exp.role}
                    {exp.is_current && <span className="badge badge-green" style={{ marginLeft: 'var(--space-2)' }}>Current</span>}
                  </td>
                  <td>{exp.organization}</td>
                  <td style={{ fontSize: 'var(--text-sm)' }}>{formatDuration(exp.duration_start, exp.duration_end, exp.is_current)}</td>
                  <td>
                    <div className="admin-table-actions">
                      <button className="admin-btn-sm" onClick={() => startEdit(exp)}>Edit</button>
                      <button className="admin-btn-sm admin-btn-danger" onClick={() => handleDelete(exp.id, exp.role)}>Delete</button>
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
