import React, { useState } from 'react'
import { useCertifications } from '../../hooks/useSupabase'
import { supabase } from '../../lib/supabase'
import { uploadFile } from '../../lib/storage'
import { formatDate } from '../../utils/helpers'

const EMPTY = { name: '', organization: '', issue_date: '', credential_url: '', certificate_image_url: '', display_order: 99 }

export default function AdminCertifications() {
  const { data, loading, refresh } = useCertifications()
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)

  const startEdit = (item) => {
    setEditing(item)
    setForm(item === 'new' ? EMPTY : { ...item })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadFile(file, 'portfolio', 'certs')
      setForm(prev => ({ ...prev, certificate_image_url: url }))
    } catch (err) {
      setError('Upload failed: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.organization) { setError('Name and organization required'); return }
    setSaving(true); setError('')
    try {
      if (editing === 'new') {
        const { error } = await supabase.from('certifications').insert(form)
        if (error) throw error
      } else {
        const { error } = await supabase.from('certifications').update(form).eq('id', editing.id)
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

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return
    await supabase.from('certifications').delete().eq('id', id)
    refresh()
  }

  if (editing) {
    return (
      <div>
        <div className="admin-page-header">
          <div><h1 className="admin-page-title">{editing === 'new' ? 'Add Certification' : 'Edit Certification'}</h1></div>
          <button className="btn btn-ghost" onClick={() => setEditing(null)}>← Cancel</button>
        </div>
        <form onSubmit={handleSubmit} className="admin-form">
          {error && <div className="alert alert-error">{error}</div>}

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="cert-name">Certificate Name *</label>
              <input id="cert-name" type="text" name="name" className="form-input" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="cert-org">Organization *</label>
              <input id="cert-org" type="text" name="organization" className="form-input" value={form.organization} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="cert-date">Issue Date</label>
              <input id="cert-date" type="date" name="issue_date" className="form-input" value={form.issue_date?.slice(0, 10) || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="cert-url">Credential URL</label>
              <input id="cert-url" type="url" name="credential_url" className="form-input" value={form.credential_url} onChange={handleChange} placeholder="https://..." />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Certificate Image</label>
            {form.certificate_image_url && (
              <img src={form.certificate_image_url} alt="Certificate preview" style={{ width: '100%', maxWidth: 400, borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-3)', border: '1px solid var(--border-default)' }} />
            )}
            <div className="upload-area" onClick={() => document.getElementById('cert-img-input').click()}>
              <div className="upload-area-icon">📜</div>
              <div className="upload-area-text">{uploading ? 'Uploading…' : 'Upload certificate image'}</div>
            </div>
            <input id="cert-img-input" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
            <p className="form-hint">Or paste URL:</p>
            <input type="url" name="certificate_image_url" className="form-input" value={form.certificate_image_url} onChange={handleChange} placeholder="https://..." />
          </div>

          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <div className="admin-page-header">
        <div><h1 className="admin-page-title">Certifications</h1></div>
        <button className="btn btn-primary" onClick={() => startEdit('new')}>+ Add Certification</button>
      </div>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 'var(--space-16)' }}><div className="spinner" /></div>
      ) : data.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📜</div>
          <div className="empty-state-title">No certifications yet</div>
          <button className="btn btn-primary" onClick={() => startEdit('new')}>Add Certification</button>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Certificate</th><th>Organization</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {data.map(cert => (
                <tr key={cert.id}>
                  <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{cert.name}</td>
                  <td>{cert.organization}</td>
                  <td style={{ fontSize: 'var(--text-sm)' }}>{cert.issue_date ? formatDate(cert.issue_date) : '—'}</td>
                  <td>
                    <div className="admin-table-actions">
                      <button className="admin-btn-sm" onClick={() => startEdit(cert)}>Edit</button>
                      {cert.credential_url && (
                        <a href={cert.credential_url} target="_blank" rel="noopener noreferrer" className="admin-btn-sm">Verify ↗</a>
                      )}
                      <button className="admin-btn-sm admin-btn-danger" onClick={() => handleDelete(cert.id, cert.name)}>Delete</button>
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
