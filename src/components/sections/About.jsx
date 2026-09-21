import React from 'react'
import { motion } from 'framer-motion'
import { useProfile } from '../../hooks/useProfile'
import { staggerContainer, staggerItem, fadeUp } from '../../utils/animations'

export default function About() {
  const { profile } = useProfile()

  return (
    <section className="section" id="about" aria-label="About me">
      <div className="container">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <motion.div variants={staggerItem}>
            <span className="section-label">About</span>
          </motion.div>

          <div className="about-grid">
            {/* Image / Visual side */}
            <motion.div
              className="about-image-wrapper"
              variants={fadeUp}
            >
              {profile.profile_image_url ? (
                <img
                  src={profile.profile_image_url}
                  alt={`${profile.name} — UI/UX Designer`}
                  className="about-image"
                />
              ) : (
                /* Placeholder when no profile image set */
                <div
                  className="about-image"
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    aspectRatio: '3/4',
                  }}
                  role="img"
                  aria-label="Profile photo placeholder"
                >
                  <span style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(4rem, 8vw, 8rem)',
                    fontWeight: 800,
                    color: 'var(--border-default)',
                    letterSpacing: '-0.05em',
                    userSelect: 'none',
                  }}>
                    {profile.name?.charAt(0) || 'H'}
                  </span>
                </div>
              )}

              {/* Years indicator */}
              <div className="about-image-accent">
                <p>3+</p>
                <span>Years designing</span>
              </div>
            </motion.div>

            {/* Content side */}
            <motion.div
              className="about-content"
              variants={staggerContainer}
            >
              <motion.h2
                className="text-display-md"
                variants={staggerItem}
                style={{ color: 'var(--text-primary)' }}
              >
                Designing with<br />
                <span style={{ color: 'var(--accent)' }}>intent, not habit</span>
              </motion.h2>

              <motion.p
                className="about-bio"
                variants={staggerItem}
                dangerouslySetInnerHTML={{
                  __html: profile.bio ||
                    'I\'m a UI/UX designer who believes that <strong>great design is invisible</strong> — it simply works, and people feel it without being able to explain why. I care deeply about the space between what users expect and what actually delights them.',
                }}
              />

              <motion.div
                className="about-philosophy"
                variants={staggerItem}
              >
                <p>
                  "{profile.philosophy || 'Design is not how it looks. It\'s how it works, how it feels, and what it makes someone do next.'}"
                </p>
              </motion.div>

              {profile.currently_exploring?.length > 0 && (
                <motion.div
                  className="about-exploring"
                  variants={staggerItem}
                >
                  <div className="about-exploring-label">Currently exploring</div>
                  <div className="about-exploring-items">
                    {profile.currently_exploring.map((item, i) => (
                      <span key={i} className="tag tag-accent">{item}</span>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
