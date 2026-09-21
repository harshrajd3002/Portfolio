import React from 'react'
import { motion } from 'framer-motion'
import { useProfile } from '../../hooks/useProfile'
import { useSocialLinks } from '../../hooks/useSupabase'
import { staggerContainer, staggerItem } from '../../utils/animations'

const SOCIAL_ICONS = {
  LinkedIn: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ),
  Figma: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.354-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.014-4.49-4.491S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.019 3.019 3.019h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 10.019c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.019 3.019 3.019h3.117v-6.038H8.148zm4.587 8.981c0 2.476-2.014 4.49-4.49 4.49s-4.49-2.014-4.49-4.49 2.014-4.49 4.49-4.49h4.49v4.49zm-4.49-3.019c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.019 3.019 3.019 3.019-1.355 3.019-3.019v-3.019H8.245zm7.607-5.962c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.49-4.49 4.49-4.49-2.014-4.49-4.49 2.014-4.49 4.49-4.49zm0 1.471c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.019 3.019 3.019 3.019-1.355 3.019-3.019-1.354-3.019-3.019-3.019z"/>
    </svg>
  ),
  Dribbble: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.017-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.816zm-11.62-2.073c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.176zM9.6 2.052c.282.38 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702-1.81-1.61-4.19-2.586-6.795-2.586-.46 0-.578.096-2.4.288zm10.335 3.483c-.218.29-1.935 2.493-5.724 4.04.24.49.47.985.68 1.486.08.18.15.36.22.53 3.41-.43 6.8.26 7.14.33-.02-2.42-.88-4.64-2.31-6.386z"/>
    </svg>
  ),
  Behance: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029H23.71zM15.9 13.4H21c-.243-1.589-1.351-1.972-2.44-1.972-1.119 0-2.183.418-2.66 1.972zm-5.515 4.093c-.447 2.03-2.11 3.286-4.487 3.286H.511V5.045h4.84c2.206 0 3.742.88 3.742 3.155 0 1.268-.617 2.286-1.782 2.847 1.638.418 2.598 1.583 2.598 3.447 0 1.176-.273 2.29-.524 2.999zm-7.74-8.697v2.96h1.928c1.035 0 1.77-.437 1.77-1.479 0-.944-.597-1.481-1.77-1.481H2.645zm0 5.065v3.247h2.19c1.241 0 1.977-.524 1.977-1.64 0-1.13-.736-1.607-1.977-1.607H2.645z"/>
    </svg>
  ),
  Instagram: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  ),
}

export default function Contact() {
  const { profile } = useProfile()
  const { data: socials } = useSocialLinks()

  const visibleSocials = socials.filter(s => s.is_visible)

  return (
    <section className="section" id="contact" aria-label="Contact">
      <div className="container">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <motion.div variants={staggerItem}>
            <span className="section-label">Contact</span>
          </motion.div>

          <div className="contact-inner">
            <motion.h2
              className="contact-heading"
              variants={staggerItem}
            >
              Have a problem<br />
              worth <span className="accent">solving?</span>
            </motion.h2>

            <motion.p
              className="contact-sub"
              variants={staggerItem}
            >
              I'm open to new projects, collaborations, and conversations about design. If you have something interesting in mind, let's talk.
            </motion.p>

            <motion.a
              href={`mailto:${profile.email || 'harshrajsinh@example.com'}`}
              className="contact-email-btn"
              variants={staggerItem}
              id="contact-email-btn"
              aria-label={`Send email to ${profile.email || 'harshrajsinh@example.com'}`}
            >
              <span>✉</span>
              {profile.email || 'harshrajsinh@example.com'}
            </motion.a>

            {visibleSocials.length > 0 && (
              <motion.div variants={staggerItem}>
                <p className="text-label text-muted" style={{ marginBottom: 'var(--space-4)' }}>
                  Find me online
                </p>
                <div className="contact-socials">
                  {visibleSocials.map(s => (
                    <a
                      key={s.id}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link"
                      aria-label={`Visit ${s.platform} profile`}
                      id={`social-${s.platform.toLowerCase()}`}
                    >
                      {SOCIAL_ICONS[s.platform] && (
                        <span aria-hidden="true">{SOCIAL_ICONS[s.platform]}</span>
                      )}
                      {s.platform}
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
