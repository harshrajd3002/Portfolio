import React, { useState, useEffect } from 'react'
import { useSocialLinks } from '../../hooks/useSupabase'
import { supabase } from '../../lib/supabase'

const PLATFORMS = ['LinkedIn', 'Figma', 'Dribbble', 'Behance', 'Instagram', 'GitHub', 'Twitter', 'YouTube', 'Website']

export default function AdminSettings() {
  const { data: socials, loading, refresh } = useSocialLinks()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editForm, setEditForm] = useState([])
  const [newLink, setNewLink] = useState({ platform: 'LinkedIn', url: '', display_order: 99, is_visible: true })

  useEffect(() => {
    if (socials.length) setEditForm(socials.map(s => ({ ...s })))
  }, [socials])

  const handleLinkChange = (id, field, value) => {
    setEditForm(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  const handleSaveAll = async () => {
    setSaving(true); setError(''); setSuccess('')
    try {
      for (const s of editForm) {
        const { error } = await supabase.from('social_links').update(s).eq('id', s.id)
        if (error) throw error
      }
      setSuccess('Social links saved!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleAddLink = async () => {
    if (!newLink.url) { setError('URL is required'); return }
    setSaving(true); setError('')
    try {
      const { error } = await supabase.from('social_links').insert(newLink)
      if (error) throw error
      await refresh()
      setNewLink({ platform: 'LinkedIn', url: '', display_order: 99, is_visible: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id, platform) => {
    if (!window.confirm(`Remove ${platform} link?`)) return
    await supabase.from('social_links').delete().eq('id', id)
    refresh()
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Settings</h1>
          <p className="admin-page-subtitle">Social links and visibility settings</p>
        </div>
      </div>

      {error && <div className="alert alert-error" style={{ marginBottom: 'var(--space-4)' }}>{error}</div>}
      {success && <div className="alert alert-success" style={{ marginBottom: 'var(--space-4)' }}>{success}</div>}

      {/* Social links */}
      <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
        <h3 className="text-heading-sm" style={{ color: 'var(--text-primary)', marginBottom: 'var(--space-5)' }}>Social Links</h3>

        {loading ? (
          <div className="spinner" />
        ) : (
          <>
            {editForm.map(s => (
              <div key={s.id} style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 500, minWidth: 100, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{s.platform}</span>
                <input
                  type="url"
                  className="form-input"
                  value={s.url}
                  onChange={e => handleLinkChange(s.id, 'url', e.target.value)}
                  placeholder="https://..."
                  style={{ flex: 1 }}
                  aria-label={`${s.platform} URL`}
                />
                <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', cursor: 'pointer', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                  <input
                    type="checkbox"
                    checked={s.is_visible}
                    onChange={e => handleLinkChange(s.id, 'is_visible', e.target.checked)}
                    aria-label={`${s.platform} visible`}
                  />
                  Show
                </label>
                <button
                  className="admin-btn-sm admin-btn-danger"
                  onClick={() => handleDelete(s.id, s.platform)}
                  aria-label={`Delete ${s.platform}`}
                >
                  ✕
                </button>
              </div>
            ))}

            <button className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }} onClick={handleSaveAll} disabled={saving}>
              {saving ? 'Saving…' : 'Save All Links'}
            </button>
          </>
        )}
      </div>

      {/* Add new social link */}
      <div className="card" style={{ padding: 'var(--space-6)' }}>
        <h3 className="text-heading-sm" style={{ color: 'var(--text-primary)', marginBottom: 'var(--space-5)' }}>Add New Social Link</h3>
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ flex: '0 1 160px', marginBottom: 0 }}>
            <label className="form-label" htmlFor="new-platform">Platform</label>
            <select
              id="new-platform"
              className="form-select"
              value={newLink.platform}
              onChange={e => setNewLink(prev => ({ ...prev, platform: e.target.value }))}
            >
              {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
            <label className="form-label" htmlFor="new-url">URL</label>
            <input
              id="new-url"
              type="url"
              className="form-input"
              value={newLink.url}
              onChange={e => setNewLink(prev => ({ ...prev, url: e.target.value }))}
              placeholder="https://..."
            />
          </div>
          <button className="btn btn-primary" onClick={handleAddLink} disabled={saving}>Add</button>
        </div>
      </div>
    </div>
  )
}
