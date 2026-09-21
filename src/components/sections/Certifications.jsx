import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCertifications } from '../../hooks/useSupabase'
import { formatDate } from '../../utils/helpers'
import { staggerContainer, staggerItem, modalVariants, overlayVariants } from '../../utils/animations'

function CertModal({ cert, onClose }) {
  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={`${cert.name} certificate`}
      >
        <motion.div
          className="modal-content"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={e => e.stopPropagation()}
        >
          <div className="modal-header">
            <div>
              <div className="cert-org">{cert.organization}</div>
              <h3 className="text-heading-lg" style={{ marginTop: 'var(--space-1)' }}>{cert.name}</h3>
            </div>
            <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
          </div>

          {cert.certificate_image_url ? (
            <img
              src={cert.certificate_image_url}
              alt={`${cert.name} certificate`}
              style={{ width: '100%', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-6)' }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                aspectRatio: '16/9',
                background: 'var(--bg-elevated)',
                border: '1px dashed var(--border-default)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 'var(--space-6)',
                color: 'var(--text-muted)',
                fontSize: 'var(--text-sm)',
              }}
            >
              Certificate image not available
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
              <span>Issued by {cert.organization}</span>
              <span>{cert.issue_date ? formatDate(cert.issue_date) : ''}</span>
            </div>

            {cert.credential_url && (
              <a
                href={cert.credential_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ alignSelf: 'flex-start' }}
              >
                Verify Credential ↗
              </a>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function Certifications() {
  const { data: certs } = useCertifications()
  const [selected, setSelected] = useState(null)

  return (
    <section className="section-sm" id="certifications" aria-label="Certifications">
      <div className="container">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <motion.div variants={staggerItem}>
            <span className="section-label">Certifications</span>
          </motion.div>

          <motion.h2
            className="text-heading-lg"
            variants={staggerItem}
            style={{ color: 'var(--text-primary)', marginBottom: 'var(--space-8)' }}
          >
            Verified credentials
          </motion.h2>

          <div className="certs-grid" role="list">
            {certs.map(cert => (
              <motion.div
                key={cert.id}
                className="cert-card"
                variants={staggerItem}
                onClick={() => setSelected(cert)}
                role="listitem button"
                tabIndex={0}
                aria-label={`View ${cert.name} certificate`}
                onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setSelected(cert)}
              >
                <div className="cert-org">{cert.organization}</div>
                <h3 className="cert-name">{cert.name}</h3>
                {cert.issue_date && (
                  <div className="cert-date">{formatDate(cert.issue_date)}</div>
                )}
                <div className="cert-link">
                  {cert.credential_url ? 'View credential ↗' : 'View certificate →'}
                </div>
              </motion.div>
            ))}

            {certs.length === 0 && (
              <div className="empty-state" style={{ gridColumn: '1/-1' }}>
                <div className="empty-state-title">No certifications yet</div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {selected && (
        <CertModal cert={selected} onClose={() => setSelected(null)} />
      )}
    </section>
  )
}
