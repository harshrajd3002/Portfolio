import React, { useState } from 'react'
import { useEducation } from '../../hooks/useSupabase'
import { supabase } from '../../lib/supabase'

const EMPTY = { degree: '', institution: '', duration_start: '', duration_end: '', relevant_areas: '', achievements: '', display_order: 99 }

export default function AdminEducation() {
  const { data, loading, refresh } = useEducation()
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const startEdit = (item) => {
    setEditing(item)
    if (item === 'new') setForm(EMPTY)
    else setForm({ ...item, relevant_areas: (item.relevant_areas || []).join(', ') })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true); setError('')
    try {
      const payload = { ...form, relevant_areas: form.relevant_areas.split(',').map(s => s.trim()).filter(Boolean) }
      if (editing === 'new') {
        const { error } = await supabase.from('education').insert(payload)
        if (error) throw error
      } else {
        const { error } = await supabase.from('education').update(payload).eq('id', editing.id)
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

  const handleDelete = async (id, degree) => {
    if (!window.confirm(`Delete "${degree}"?`)) return
    await supabase.from('education').delete().eq('id', id)
    refresh()
  }

  if (editing) {
    return (
      <div>
        <div className="admin-page-header">
          <div><h1 className="admin-page-title">{editing === 'new' ? 'Add Education' : 'Edit Education'}</h1></div>
          <button className="btn btn-ghost" onClick={() => setEditing(null)}>← Cancel</button>
        </div>
        <form onSubmit={handleSubmit} className="admin-form">
          {error && <div className="alert alert-error">{error}</div>}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="edu-degree">Degree *</label>
              <input id="edu-degree" type="text" name="degree" className="form-input" value={form.degree} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="edu-inst">Institution *</label>
              <input id="edu-inst" type="text" name="institution" className="form-input" value={form.institution} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="edu-start">Start Date</label>
              <input id="edu-start" type="date" name="duration_start" className="form-input" value={form.duration_start?.slice(0, 10) || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="edu-end">End Date</label>
              <input id="edu-end" type="date" name="duration_end" className="form-input" value={form.duration_end?.slice(0, 10) || ''} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="edu-areas">Relevant Areas</label>
            <input id="edu-areas" type="text" name="relevant_areas" className="form-input" value={form.relevant_areas} onChange={handleChange} placeholder="Typography, HCI, Product Design" />
            <p className="form-hint">Comma-separated</p>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="edu-ach">Achievements</label>
            <textarea id="edu-ach" name="achievements" className="form-textarea" value={form.achievements} onChange={handleChange} style={{ minHeight: 80 }} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <div className="admin-page-header">
        <div><h1 className="admin-page-title">Education</h1></div>
        <button className="btn btn-primary" onClick={() => startEdit('new')}>+ Add Education</button>
      </div>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 'var(--space-16)' }}><div className="spinner" /></div>
      ) : data.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🎓</div>
          <div className="empty-state-title">No education yet</div>
          <button className="btn btn-primary" onClick={() => startEdit('new')}>Add Education</button>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Degree</th><th>Institution</th><th>Period</th><th>Actions</th></tr></thead>
            <tbody>
              {data.map(edu => (
                <tr key={edu.id}>
                  <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{edu.degree}</td>
                  <td>{edu.institution}</td>
                  <td style={{ fontSize: 'var(--text-sm)' }}>
                    {edu.duration_start ? new Date(edu.duration_start).getFullYear() : ''}
                    {edu.duration_end ? ` — ${new Date(edu.duration_end).getFullYear()}` : ''}
                  </td>
                  <td>
                    <div className="admin-table-actions">
                      <button className="admin-btn-sm" onClick={() => startEdit(edu)}>Edit</button>
                      <button className="admin-btn-sm admin-btn-danger" onClick={() => handleDelete(edu.id, edu.degree)}>Delete</button>
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
