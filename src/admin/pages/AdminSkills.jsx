import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSkills } from '../../hooks/useSupabase'
import { supabase } from '../../lib/supabase'

const CATEGORIES = [
  { key: 'design', label: 'Design' },
  { key: 'ux', label: 'UX & Research' },
  { key: 'tools', label: 'Tools' },
]

const EMPTY = { name: '', category: 'design', display_order: 99 }

export default function AdminSkills() {
  const { data, loading, refresh } = useSkills()
  const [form, setForm] = useState(EMPTY)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const grouped = CATEGORIES.map(cat => ({
    ...cat,
    skills: data.filter(s => s.category === cat.key),
  }))

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const startEdit = (skill) => {
    setEditingId(skill.id)
    setForm({ name: skill.name, category: skill.category, display_order: skill.display_order })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    setSaving(true); setError('')
    try {
      if (editingId) {
        const { error } = await supabase.from('skills').update(form).eq('id', editingId)
        if (error) throw error
        setEditingId(null)
      } else {
        const { error } = await supabase.from('skills').insert(form)
        if (error) throw error
      }
      setForm(EMPTY)
      await refresh()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return
    await supabase.from('skills').delete().eq('id', id)
    refresh()
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Skills</h1>
          <p className="admin-page-subtitle">{data.length} skills across {CATEGORIES.length} categories</p>
        </div>
      </div>

      {error && <div className="alert alert-error" style={{ marginBottom: 'var(--space-4)' }} role="alert">{error}</div>}

      {/* Add/Edit form */}
      <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
        <h3 className="text-heading-sm" style={{ marginBottom: 'var(--space-4)', color: 'var(--text-primary)' }}>
          {editingId ? 'Edit Skill' : 'Add Skill'}
        </h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ flex: '1 1 200px', marginBottom: 0 }}>
            <label className="form-label" htmlFor="skill-name">Skill Name</label>
            <input id="skill-name" type="text" name="name" className="form-input" value={form.name} onChange={handleChange} placeholder="e.g. Interaction Design" required />
          </div>
          <div className="form-group" style={{ flex: '0 1 160px', marginBottom: 0 }}>
            <label className="form-label" htmlFor="skill-cat">Category</label>
            <select id="skill-cat" name="category" className="form-select" value={form.category} onChange={handleChange}>
              {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ flex: '0 1 100px', marginBottom: 0 }}>
            <label className="form-label" htmlFor="skill-order">Order</label>
            <input id="skill-order" type="number" name="display_order" className="form-input" value={form.display_order} onChange={handleChange} min={1} />
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? '…' : (editingId ? 'Update' : 'Add')}
            </button>
            {editingId && (
              <button type="button" className="btn btn-ghost" onClick={() => { setEditingId(null); setForm(EMPTY) }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Skills by category */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 'var(--space-8)' }}><div className="spinner" /></div>
      ) : (
        grouped.map(({ key, label, skills }) => (
          <div key={key} style={{ marginBottom: 'var(--space-6)' }}>
            <h3 className="text-label text-muted" style={{ marginBottom: 'var(--space-3)' }}>{label}</h3>
            {skills.length === 0 ? (
              <p className="text-muted text-body-sm">No skills in this category yet.</p>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                {skills.map(skill => (
                  <div
                    key={skill.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-2)',
                      padding: 'var(--space-2) var(--space-3)',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>{skill.name}</span>
                    <button
                      onClick={() => startEdit(skill)}
                      className="admin-btn-sm"
                      style={{ padding: '1px 6px', fontSize: 'var(--text-xs)' }}
                      aria-label={`Edit ${skill.name}`}
                    >
                      ✎
                    </button>
                    <button
                      onClick={() => handleDelete(skill.id, skill.name)}
                      className="admin-btn-sm admin-btn-danger"
                      style={{ padding: '1px 6px', fontSize: 'var(--text-xs)' }}
                      aria-label={`Delete ${skill.name}`}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}
