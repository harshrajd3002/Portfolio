import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { uploadFile } from '../../lib/storage'
import { slugify } from '../../utils/helpers'
import { PLACEHOLDER_PROJECTS } from '../../hooks/useProjects'

const EMPTY_PROJECT = {
  title: '',
  slug: '',
  category: '',
  short_description: '',
  role: '',
  thumbnail_url: '',
  tools: '',
  problem: '',
  process: '',
  solution: '',
  outcome: '',
  live_url: '',
  featured: false,
  published: false,
  display_order: 99,
}

export default function AdminProjectEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = id === 'new'

  const [form, setForm] = useState(EMPTY_PROJECT)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (isNew) return
    async function load() {
      try {
        const { data, error } = await supabase.from('projects').select('*').eq('id', id).single()
        if (error) throw error
        setForm({
          ...data,
          tools: Array.isArray(data.tools) ? data.tools.join(', ') : (data.tools || ''),
        })
      } catch {
        // Try placeholder
        const found = PLACEHOLDER_PROJECTS.find(p => String(p.id) === id)
        if (found) setForm({ ...found, tools: (found.tools || []).join(', ') })
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, isNew])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    // Auto-generate slug from title
    if (name === 'title') {
      setForm(prev => ({ ...prev, title: value, slug: slugify(value) }))
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) { setError('Image must be under 10MB'); return }
    setUploading(true)
    try {
      const url = await uploadFile(file, 'portfolio', 'projects')
      setForm(prev => ({ ...prev, thumbnail_url: url }))
    } catch (err) {
      setError('Upload failed: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.slug) { setError('Title and slug are required.'); return }
    setSaving(true); setError(''); setSuccess(false)
    try {
      const payload = {
        ...form,
        tools: form.tools.split(',').map(s => s.trim()).filter(Boolean),
      }
      if (isNew) {
        const { error } = await supabase.from('projects').insert(payload)
        if (error) throw error
        navigate('/admin/projects')
      } else {
        const { error } = await supabase.from('projects').update(payload).eq('id', id)
        if (error) throw error
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 'var(--space-16)' }}><div className="spinner" /></div>

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{isNew ? 'New Project' : 'Edit Project'}</h1>
          <p className="admin-page-subtitle">{isNew ? 'Add a new case study' : `Editing: ${form.title}`}</p>
        </div>
        <Link to="/admin/projects" className="btn btn-ghost">← Back</Link>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        {error && <div className="alert alert-error" role="alert">{error}</div>}
        {success && <div className="alert alert-success" role="status">Project saved!</div>}

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="proj-title">Title *</label>
            <input id="proj-title" type="text" name="title" className="form-input" value={form.title} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="proj-slug">Slug *</label>
            <input id="proj-slug" type="text" name="slug" className="form-input" value={form.slug} onChange={handleChange} required />
            <p className="form-hint">URL: /projects/{form.slug}</p>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="proj-category">Category</label>
            <input id="proj-category" type="text" name="category" className="form-input" value={form.category} onChange={handleChange} placeholder="Mobile App, Web App, Design System…" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="proj-role">Your Role</label>
            <input id="proj-role" type="text" name="role" className="form-input" value={form.role} onChange={handleChange} placeholder="Lead UX Designer" />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="proj-desc">Short Description</label>
          <textarea id="proj-desc" name="short_description" className="form-textarea" value={form.short_description} onChange={handleChange} style={{ minHeight: 80 }} />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="proj-tools">Tools Used</label>
          <input id="proj-tools" type="text" name="tools" className="form-input" value={form.tools} onChange={handleChange} placeholder="Figma, FigJam, Maze" />
          <p className="form-hint">Comma-separated</p>
        </div>

        {/* Thumbnail */}
        <div className="form-group">
          <label className="form-label">Thumbnail Image</label>
          {form.thumbnail_url && (
            <img src={form.thumbnail_url} alt="Thumbnail preview" style={{ width: 200, height: 120, objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-3)', border: '1px solid var(--border-default)' }} />
          )}
          <div className="upload-area" onClick={() => document.getElementById('thumb-upload').click()}>
            <div className="upload-area-icon">🖼️</div>
            <div className="upload-area-text">{uploading ? 'Uploading…' : 'Upload thumbnail'}</div>
            <div className="upload-area-hint">JPG, PNG, WebP · Max 10MB</div>
          </div>
          <input id="thumb-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
          <p className="form-hint">Or paste URL:</p>
          <input type="url" name="thumbnail_url" className="form-input" value={form.thumbnail_url} onChange={handleChange} placeholder="https://..." />
        </div>

        {/* Case study content */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-6)', marginTop: 'var(--space-2)' }}>
          <h3 className="admin-page-subtitle" style={{ marginBottom: 'var(--space-6)', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Case Study Content
          </h3>

          <div className="form-group">
            <label className="form-label" htmlFor="proj-problem">The Problem</label>
            <textarea id="proj-problem" name="problem" className="form-textarea" value={form.problem} onChange={handleChange} placeholder="What problem were you solving? Who was affected?" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="proj-process">The Thinking / Process</label>
            <textarea id="proj-process" name="process" className="form-textarea" value={form.process} onChange={handleChange} placeholder="How did you approach the problem? What methods did you use?" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="proj-solution">The Solution</label>
            <textarea id="proj-solution" name="solution" className="form-textarea" value={form.solution} onChange={handleChange} placeholder="What did you design? What made it effective?" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="proj-outcome">The Outcome</label>
            <textarea id="proj-outcome" name="outcome" className="form-textarea" value={form.outcome} onChange={handleChange} placeholder="What was the result? Metrics, feedback, impact?" />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="proj-live">Live URL</label>
          <input id="proj-live" type="url" name="live_url" className="form-input" value={form.live_url} onChange={handleChange} placeholder="https://..." />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="proj-order">Display Order</label>
            <input id="proj-order" type="number" name="display_order" className="form-input" value={form.display_order} onChange={handleChange} min={1} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer' }}>
            <input type="checkbox" name="published" checked={form.published} onChange={handleChange} />
            <span className="form-label" style={{ marginBottom: 0 }}>Published</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer' }}>
            <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
            <span className="form-label" style={{ marginBottom: 0 }}>Featured</span>
          </label>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <button type="submit" className="btn btn-primary" disabled={saving} id="proj-save">
            {saving ? 'Saving…' : (isNew ? 'Create Project' : 'Save Changes')}
          </button>
          <Link to="/admin/projects" className="btn btn-ghost">Cancel</Link>
        </div>
      </form>
    </div>
  )
}
