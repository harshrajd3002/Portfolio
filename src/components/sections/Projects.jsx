import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useProjects } from '../../hooks/useProjects'
import { staggerContainer, staggerItem } from '../../utils/animations'

function ProjectRow({ project, index }) {
  return (
    <motion.div variants={staggerItem}>
      <Link
        to={`/projects/${project.slug}`}
        className="project-row"
        aria-label={`View ${project.title} case study`}
      >
        <span className="project-num">
          {String(index + 1).padStart(2, '0')}
        </span>

        <div className="project-info">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            <h3 className="project-name">{project.title}</h3>
            {project.featured && (
              <span className="badge badge-yellow">Featured</span>
            )}
          </div>
          <div className="project-meta">
            <span className="tag">{project.category}</span>
            <span className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>·</span>
            <span className="text-muted" style={{ fontSize: 'var(--text-sm)' }}>{project.role}</span>
          </div>
          <p className="project-desc">{project.short_description}</p>
        </div>

        {/* Hover preview */}
        {project.thumbnail_url && (
          <div className="project-preview" aria-hidden="true">
            <img
              src={project.thumbnail_url}
              alt={`${project.title} preview`}
              loading="lazy"
            />
          </div>
        )}

        <span className="project-arrow" aria-hidden="true">↗</span>
      </Link>
    </motion.div>
  )
}

export default function Projects() {
  const { projects, loading } = useProjects()

  return (
    <section className="section" id="projects" aria-label="Projects">
      <div className="container">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <motion.div
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-4)' }}
            variants={staggerItem}
          >
            <span className="section-label">Work</span>
          </motion.div>

          <motion.div
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--space-10)', flexWrap: 'wrap', gap: 'var(--space-6)' }}
            variants={staggerItem}
          >
            <h2 className="text-display-md" style={{ color: 'var(--text-primary)' }}>
              Selected<br />
              <span style={{ color: 'var(--accent)' }}>case studies</span>
            </h2>
            <p className="text-secondary" style={{ maxWidth: '320px', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
              Each project is a story of a problem understood, a process navigated, and a solution that made things better.
            </p>
          </motion.div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-16)' }}>
              <div className="spinner" />
            </div>
          ) : projects.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">✦</div>
              <div className="empty-state-title">Projects coming soon</div>
              <div className="empty-state-desc">Check back later for case studies.</div>
            </div>
          ) : (
            <div className="projects-list" role="list">
              {projects.map((project, i) => (
                <ProjectRow key={project.id} project={project} index={i} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
