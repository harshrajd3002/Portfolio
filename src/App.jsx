import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import LoadingScreen from './components/layout/LoadingScreen'
import Navigation from './components/layout/Navigation'
import Home from './pages/Home'
import ProjectCase from './pages/ProjectCase'
import AdminLogin from './admin/AdminLogin'
import AdminLayout from './admin/AdminLayout'
import AdminProfile from './admin/pages/AdminProfile'
import AdminProjects from './admin/pages/AdminProjects'
import AdminProjectEdit from './admin/pages/AdminProjectEdit'
import AdminExperience from './admin/pages/AdminExperience'
import AdminSkills from './admin/pages/AdminSkills'
import AdminEducation from './admin/pages/AdminEducation'
import AdminCertifications from './admin/pages/AdminCertifications'
import AdminSettings from './admin/pages/AdminSettings'

function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(4rem, 10vw, 8rem)', fontWeight: 800, color: 'var(--border-default)', letterSpacing: '-0.04em' }}>404</div>
      <p style={{ fontSize: 'var(--text-lg)', color: 'var(--text-secondary)' }}>This page doesn't exist.</p>
      <a href="/" style={{ color: 'var(--accent)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>Go home</a>
    </div>
  )
}

export default function App() {
  const [loaded, setLoaded] = useState(false)

  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        {!loaded && (
          <LoadingScreen key="loading" onComplete={() => setLoaded(true)} />
        )}
      </AnimatePresence>

      {loaded && (
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<><Navigation /><Home /></>} />
          <Route path="/projects/:slug" element={<><Navigation /><ProjectCase /></>} />

          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<Navigate to="/admin/profile" replace />} />
          <Route path="/admin/profile" element={<AdminLayout><AdminProfile /></AdminLayout>} />
          <Route path="/admin/projects" element={<AdminLayout><AdminProjects /></AdminLayout>} />
          <Route path="/admin/projects/:id" element={<AdminLayout><AdminProjectEdit /></AdminLayout>} />
          <Route path="/admin/experience" element={<AdminLayout><AdminExperience /></AdminLayout>} />
          <Route path="/admin/skills" element={<AdminLayout><AdminSkills /></AdminLayout>} />
          <Route path="/admin/education" element={<AdminLayout><AdminEducation /></AdminLayout>} />
          <Route path="/admin/certifications" element={<AdminLayout><AdminCertifications /></AdminLayout>} />
          <Route path="/admin/settings" element={<AdminLayout><AdminSettings /></AdminLayout>} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      )}
    </BrowserRouter>
  )
}
