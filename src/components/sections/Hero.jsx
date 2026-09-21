import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useProfile } from '../../hooks/useProfile'

export default function Hero() {
  const { profile } = useProfile()

  const handleScrollToProjects = (e) => {
    e.preventDefault()
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleScrollToContact = (e) => {
    e.preventDefault()
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  const firstName = profile.name?.split(' ')[0] || 'Harshrajsinh'
  const lastName = profile.name?.split(' ').slice(1).join(' ') || 'Dodiya'

  return (
    <section className="hero" id="home" aria-label="Introduction">
      {/* Architectural grid background */}
      <div className="hero-bg-grid" aria-hidden="true" />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Status indicator */}
        <motion.div
          className="hero-eyebrow"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="hero-status-dot" aria-hidden="true" />
          <span className="text-label text-muted">Available for work</span>
        </motion.div>

        {/* Main title — staggered letter reveal */}
        <h1 className="hero-title" aria-label={`${firstName} ${lastName}, UI/UX Designer`}>
          <motion.span
            className="line"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {firstName}
          </motion.span>
          <motion.span
            className="line"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {lastName}
          </motion.span>
          <motion.span
            className="line accent-word"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--accent)' }}
          >
            {profile.headline || 'UI/UX Designer'}
          </motion.span>
        </h1>

        {/* Bottom: tagline + actions */}
        <div className="hero-bottom">
          <motion.p
            className="hero-tagline"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            I design products where <strong>clarity meets intention</strong> — where every decision serves the person using it.
          </motion.p>

          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
          >
            <a
              href="#projects"
              className="btn btn-primary"
              onClick={handleScrollToProjects}
              id="hero-view-projects"
            >
              View Projects
            </a>
            <a
              href="#contact"
              className="btn btn-ghost"
              onClick={handleScrollToContact}
              id="hero-contact"
            >
              Let's Connect
            </a>
          </motion.div>
        </div>
      </div>

      {/* Scroll hint */}
      <motion.div
        className="hero-scroll-hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        aria-hidden="true"
      >
        <div className="hero-scroll-line" />
        <span>scroll</span>
      </motion.div>
    </section>
  )
}
