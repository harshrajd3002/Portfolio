import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSkills } from '../../hooks/useSupabase'
import { staggerContainer, staggerItem } from '../../utils/animations'

const CATEGORIES = [
  { key: 'design', label: 'Design' },
  { key: 'ux', label: 'UX & Research' },
  { key: 'tools', label: 'Tools' },
]

export default function Skills() {
  const { data: skills } = useSkills()
  const [activeTab, setActiveTab] = useState('design')

  const filtered = skills.filter(s => s.category === activeTab)

  return (
    <section className="section" id="skills" aria-label="Skills">
      <div className="container">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <motion.div variants={staggerItem}>
            <span className="section-label">Skills</span>
          </motion.div>

          <motion.div
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--space-10)', flexWrap: 'wrap', gap: 'var(--space-6)' }}
            variants={staggerItem}
          >
            <h2 className="text-display-md" style={{ color: 'var(--text-primary)' }}>
              The tools behind<br />
              <span style={{ color: 'var(--accent)' }}>the thinking</span>
            </h2>
          </motion.div>

          {/* Tabs */}
          <motion.div
            className="skills-tabs"
            variants={staggerItem}
            role="tablist"
            aria-label="Skill categories"
          >
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                className={`skills-tab ${activeTab === cat.key ? 'active' : ''}`}
                onClick={() => setActiveTab(cat.key)}
                role="tab"
                aria-selected={activeTab === cat.key}
                aria-controls={`skills-panel-${cat.key}`}
                id={`skills-tab-${cat.key}`}
              >
                {cat.label}
              </button>
            ))}
          </motion.div>

          {/* Skills grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              className="skills-grid"
              role="tabpanel"
              id={`skills-panel-${activeTab}`}
              aria-labelledby={`skills-tab-${activeTab}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {filtered.map((skill) => (
                <motion.div
                  key={skill.id}
                  className="skill-item"
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="skill-item-name">{skill.name}</div>
                </motion.div>
              ))}

              {filtered.length === 0 && (
                <div className="empty-state" style={{ gridColumn: '1/-1' }}>
                  <div className="empty-state-title">No skills in this category yet</div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
