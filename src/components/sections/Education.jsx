import React from 'react'
import { motion } from 'framer-motion'
import { useEducation } from '../../hooks/useSupabase'
import { formatDate } from '../../utils/helpers'
import { staggerContainer, staggerItem } from '../../utils/animations'

export default function Education() {
  const { data: education } = useEducation()

  return (
    <section className="section-sm" id="education" aria-label="Education">
      <div className="container">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <motion.div variants={staggerItem}>
            <span className="section-label">Education</span>
          </motion.div>

          <motion.h2
            className="text-heading-lg"
            variants={staggerItem}
            style={{ color: 'var(--text-primary)', marginBottom: 'var(--space-8)' }}
          >
            Academic foundation
          </motion.h2>

          <div className="education-list" role="list">
            {education.map((edu) => (
              <motion.div
                key={edu.id}
                className="education-item"
                variants={staggerItem}
                role="listitem"
              >
                <div className="education-year">
                  {edu.duration_start ? new Date(edu.duration_start).getFullYear() : ''}
                </div>

                <div>
                  <h3 className="education-degree">{edu.degree}</h3>
                  <p className="education-institution">
                    {edu.institution}
                    {edu.duration_end && (
                      <span style={{ marginLeft: 'var(--space-3)', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
                        · {new Date(edu.duration_end).getFullYear()}
                      </span>
                    )}
                  </p>

                  {edu.relevant_areas?.length > 0 && (
                    <div className="education-areas">
                      {edu.relevant_areas.map((area, i) => (
                        <span key={i} className="tag">{area}</span>
                      ))}
                    </div>
                  )}

                  {edu.achievements && (
                    <p className="text-body-sm text-muted" style={{ marginTop: 'var(--space-3)' }}>
                      {edu.achievements}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
