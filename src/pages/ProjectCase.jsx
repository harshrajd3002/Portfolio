import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useProjects, PLACEHOLDER_PROJECTS } from '../hooks/useProjects'
import { supabase } from '../lib/supabase'
import Footer from '../components/layout/Footer'
import { formatDate } from '../utils/helpers'
import { staggerContainer, staggerItem, fadeUp } from '../utils/animations'

function CaseStudySection({ label, title, children }) {
  return (
    <motion.div className="case-study-section" variants={staggerItem}>
      <div className="case-study-section-label">{label}</div>
      {title && <h3 className="case-study-section-title">{title}</h3>}
      <div className="case-study-section-body">{children}</div>
    </motion.div>
  )
}

export default function ProjectCase() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('slug', slug)
          .eq('published', true)
          .single()

        if (error) throw error
        setProject(data)
      } catch (err) {
        // Fallback to placeholder
        const found = PLACEHOLDER_PROJECTS.find(p => p.slug === slug)
        if (found) setProject(found)
        else setError('Project not found')
      } finally {
        setLoading(false)
      }
    }
    load()
    window.scrollTo(0, 0)
  }, [slug])

  // Update document title
  useEffect(() => {
    if (project) {
      document.title = `${project.title} — Harshrajsinh Dodiya`
    }
    return () => { document.title = 'Harshrajsinh Dodiya — UI/UX Designer' }
  }, [project])

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div className="spinner" />
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="case-study">
        <div className="container" style={{ paddingTop: '20vh', textAlign: 'center' }}>
          <div className="empty-state">
            <div className="empty-state-icon">◎</div>
            <div className="empty-state-title">Project not found</div>
            <div className="empty-state-desc">This project doesn't exist or has been removed.</div>
            <Link to="/" className="btn btn-primary">Back to Portfolio</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <article className="case-study" aria-label={`${project.title} case study`}>
      <div className="container">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Back button */}
          <motion.div variants={staggerItem} style={{ marginBottom: 'var(--space-8)' }}>
            <Link
              to="/#projects"
              className="btn btn-ghost"
              style={{ display: 'inline-flex' }}
            >
              ← All Projects
            </Link>
          </motion.div>

          {/* Hero */}
          <div className="case-study-hero">
            <motion.div variants={staggerItem}>
              <span className="section-label">{project.category}</span>
            </motion.div>

            <motion.h1 className="case-study-title" variants={staggerItem}>
              {project.title}
            </motion.h1>

            <motion.p
              style={{ fontSize: 'var(--text-xl)', color: 'var(--text-secondary)', maxWidth: '600px', lineHeight: 1.6 }}
              variants={staggerItem}
            >
              {project.short_description}
            </motion.p>

            {/* Meta */}
            <motion.div className="case-study-meta" variants={staggerItem}>
              {project.role && (
                <div className="case-study-meta-item">
                  <span className="case-study-meta-label">Role</span>
                  <span className="case-study-meta-value">{project.role}</span>
                </div>
              )}
              {project.tools?.length > 0 && (
                <div className="case-study-meta-item">
                  <span className="case-study-meta-label">Tools</span>
                  <span className="case-study-meta-value">{project.tools.join(', ')}</span>
                </div>
              )}
              {project.live_url && (
                <div className="case-study-meta-item">
                  <span className="case-study-meta-label">Live</span>
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="case-study-meta-value"
                    style={{ color: 'var(--accent)', textDecoration: 'underline' }}
                  >
                    View Project ↗
                  </a>
                </div>
              )}
            </motion.div>
          </div>

          {/* Cover image */}
          {project.thumbnail_url && (
            <motion.img
              src={project.thumbnail_url}
              alt={`${project.title} — hero image`}
              className="case-study-cover"
              variants={fadeUp}
            />
          )}

          {/* Case study content */}
          {project.problem && (
            <CaseStudySection label="The Problem" title="What wasn't working">
              {project.problem}
            </CaseStudySection>
          )}

          {project.process && (
            <CaseStudySection label="The Thinking" title="How I approached it">
              {project.process}
            </CaseStudySection>
          )}

          {/* Images grid */}
          {project.images?.length > 0 && (
            <motion.div className="case-study-images" variants={staggerItem}>
              {project.images.slice(0, 4).map((img, i) => (
                <img
                  key={i}
                  src={typeof img === 'string' ? img : img.url}
                  alt={typeof img === 'object' ? img.caption || `${project.title} screenshot ${i + 1}` : `${project.title} screenshot ${i + 1}`}
                  loading="lazy"
                />
              ))}
            </motion.div>
          )}

          {project.solution && (
            <CaseStudySection label="The Solution" title="What we built">
              {project.solution}
            </CaseStudySection>
          )}

          {project.outcome && (
            <CaseStudySection label="The Outcome" title="What changed">
              {project.outcome}
            </CaseStudySection>
          )}

          {/* Next project / CTA */}
          <motion.div
            variants={staggerItem}
            style={{
              paddingBlock: 'var(--space-16)',
              display: 'flex',
              gap: 'var(--space-4)',
              flexWrap: 'wrap',
            }}
          >
            <Link to="/#projects" className="btn btn-ghost">
              ← All Projects
            </Link>
            <Link to="/#contact" className="btn btn-primary">
              Work Together
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <Footer />
    </article>
  )
}
