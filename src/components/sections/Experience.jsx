import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useExperience } from '../../hooks/useSupabase'
import { formatDuration } from '../../utils/helpers'
import { staggerContainer, staggerItem } from '../../utils/animations'

export default function Experience() {
  const { data: experiences } = useExperience()
  const [expanded, setExpanded] = useState(null)

  const toggle = (id) => setExpanded(expanded === id ? null : id)

  return (
    <section className="section" id="experience" aria-label="Work experience">
      <div className="container">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <motion.div variants={staggerItem}>
            <span className="section-label">Experience</span>
          </motion.div>

          <motion.h2
            className="text-display-md"
            variants={staggerItem}
            style={{ color: 'var(--text-primary)', marginBottom: 'var(--space-12)' }}
          >
            Where I've<br />
            <span style={{ color: 'var(--accent)' }}>done the work</span>
          </motion.h2>

          <div className="experience-list" role="list">
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.id}
                variants={staggerItem}
                role="listitem"
              >
                <div
                  className={`experience-item ${expanded === exp.id ? 'expanded' : ''}`}
                  onClick={() => toggle(exp.id)}
                  role="button"
                  tabIndex={0}
                  aria-expanded={expanded === exp.id}
                  onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' ? toggle(exp.id) : null}
                >
                  <div className="exp-meta">
                    <span className="exp-duration text-muted">
                      {formatDuration(exp.duration_start, exp.duration_end, exp.is_current)}
                    </span>
                    {exp.location && (
                      <span className="exp-location">{exp.location}</span>
                    )}
                  </div>

                  <div className="exp-main">
                    <h3 className="exp-role">{exp.role}</h3>
                    <div className="exp-org text-secondary">
                      {exp.organization}
                      {exp.is_current && (
                        <span className="badge badge-green" style={{ marginLeft: 'var(--space-3)' }}>
                          Current
                        </span>
                      )}
                    </div>

                    {/* Expandable details */}
                    <AnimatePresence>
                      {expanded === exp.id && (
                        <motion.div
                          className="exp-details"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        >
                          {exp.responsibilities?.length > 0 && (
                            <ul className="exp-responsibilities" aria-label="Responsibilities">
                              {exp.responsibilities.map((item, j) => (
                                <li key={j}>{item}</li>
                              ))}
                            </ul>
                          )}
                          {exp.outcome && (
                            <div className="exp-outcome">
                              <strong>Impact: </strong>{exp.outcome}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Expand icon */}
                  <motion.span
                    className="exp-expand-icon"
                    aria-hidden="true"
                    animate={{ rotate: expanded === exp.id ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    ↓
                  </motion.span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
