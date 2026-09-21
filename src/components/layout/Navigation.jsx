import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_LINKS = [
  { label: 'Work', href: '#projects' },
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Process', href: '#process' },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const location = useLocation()

  const isHomePage = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Intersection observer for active section
  useEffect(() => {
    if (!isHomePage) return
    const sections = document.querySelectorAll('section[id]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { threshold: 0.3, rootMargin: '-80px 0px -40% 0px' }
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [isHomePage])

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const handleNavClick = (href) => {
    setMobileOpen(false)
    if (href.startsWith('#') && isHomePage) {
      const el = document.querySelector(href)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`} role="navigation" aria-label="Main navigation">
        <div className="container nav-inner">
          <Link to="/" className="nav-logo" aria-label="Harshrajsinh Dodiya — Home">
            Harshrajsinh<span>.</span>
          </Link>

          {/* Desktop nav */}
          <div className="nav-links" role="list">
            {isHomePage && NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`nav-link ${activeSection === link.href.slice(1) ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick(link.href)
                }}
                role="listitem"
              >
                {link.label}
              </a>
            ))}
            {!isHomePage && (
              <Link to="/" className="nav-link">← Back</Link>
            )}
          </div>

          <Link to="/#contact" className="btn btn-ghost nav-cta" onClick={() => handleNavClick('#contact')}>
            Let's Connect
          </Link>

          {/* Mobile menu button */}
          <button
            className={`nav-menu-btn ${mobileOpen ? 'open' : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="nav-mobile open"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.06, delayChildren: 0.1 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}
            >
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  className="nav-mobile-link"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  onClick={(e) => {
                    e.preventDefault()
                    handleNavClick(link.href)
                  }}
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                href="#contact"
                className="nav-mobile-link"
                style={{ color: 'var(--accent)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick('#contact')
                }}
              >
                Connect
              </motion.a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
