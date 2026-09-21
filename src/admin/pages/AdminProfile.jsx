import React, { useState, useEffect } from 'react'
import { useProfile } from '../../hooks/useProfile'
import { uploadFile } from '../../lib/storage'

export default function AdminProfile() {
  const { profile, loading, updateProfile } = useProfile()
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || '',
        headline: profile.headline || '',
        bio: profile.bio || '',
        philosophy: profile.philosophy || '',
        currently_exploring: (profile.currently_exploring || []).join(', '),
        email: profile.email || '',
        resume_url: profile.resume_url || '',
        profile_image_url: profile.profile_image_url || '',
      })
    }
  }, [profile])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB')
      return
    }
    setUploading(true)
    try {
      const url = await uploadFile(file, 'portfolio', 'profile')
      setForm(prev => ({ ...prev, profile_image_url: url }))
    } catch (err) {
      setError('Image upload failed: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess(false)
    try {
      await updateProfile({
        ...form,
        currently_exploring: form.currently_exploring
          .split(',')
          .map(s => s.trim())
          .filter(Boolean),
      })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
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
          <h1 className="admin-page-title">Profile</h1>
          <p className="admin-page-subtitle">Your public profile information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        {error && <div className="alert alert-error" role="alert">{error}</div>}
        {success && <div className="alert alert-success" role="status">Profile updated successfully!</div>}

        {/* Profile image */}
        <div className="form-group">
          <label className="form-label">Profile Image</label>
          {form.profile_image_url && (
            <img
              src={form.profile_image_url}
              alt="Profile preview"
              style={{ width: 80, height: 80, borderRadius: 'var(--radius-md)', objectFit: 'cover', marginBottom: 'var(--space-3)', border: '1px solid var(--border-default)' }}
            />
          )}
          <div className="upload-area" onClick={() => document.getElementById('profile-image-input').click()}>
            <div className="upload-area-icon">📷</div>
            <div className="upload-area-text">{uploading ? 'Uploading…' : 'Click to upload profile photo'}</div>
            <div className="upload-area-hint">JPG, PNG, WebP · Max 5MB</div>
          </div>
          <input
            id="profile-image-input"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageUpload}
          />
          <p className="form-hint">Or paste an image URL below</p>
          <input
            type="url"
            name="profile_image_url"
            className="form-input"
            placeholder="https://..."
            value={form.profile_image_url}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="profile-name">Full Name</label>
            <input id="profile-name" type="text" name="name" className="form-input" value={form.name || ''} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="profile-headline">Headline / Title</label>
            <input id="profile-headline" type="text" name="headline" className="form-input" value={form.headline || ''} onChange={handleChange} placeholder="UI/UX Designer" />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="profile-bio">Bio</label>
          <textarea id="profile-bio" name="bio" className="form-textarea" value={form.bio || ''} onChange={handleChange} placeholder="A short description of who you are and what you do. You can use <strong> tags for emphasis." />
          <p className="form-hint">HTML supported: &lt;strong&gt;, &lt;em&gt;</p>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="profile-philosophy">Design Philosophy</label>
          <textarea id="profile-philosophy" name="philosophy" className="form-textarea" value={form.philosophy || ''} onChange={handleChange} placeholder="Your design philosophy — shown as a pull quote" style={{ minHeight: 80 }} />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="profile-exploring">Currently Exploring</label>
          <input id="profile-exploring" type="text" name="currently_exploring" className="form-input" value={form.currently_exploring || ''} onChange={handleChange} placeholder="Motion Design, Design Systems, Accessibility" />
          <p className="form-hint">Comma-separated list of topics you're currently exploring</p>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="profile-email">Contact Email</label>
            <input id="profile-email" type="email" name="email" className="form-input" value={form.email || ''} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="profile-resume">Resume URL</label>
            <input id="profile-resume" type="url" name="resume_url" className="form-input" value={form.resume_url || ''} onChange={handleChange} placeholder="https://..." />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={saving} id="profile-save">
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}
