import React from 'react'
import { Link } from 'react-router-dom'
import { useSocialLinks } from '../../hooks/useSupabase'
import { useProfile } from '../../hooks/useProfile'

const SOCIAL_ICONS = {
  LinkedIn: '↗',
  Figma: '✦',
  Dribbble: '◉',
  Behance: 'Be',
  Instagram: '◎',
  GitHub: '◈',
  Twitter: '✕',
}

export default function Footer() {
  const { data: socials } = useSocialLinks()
  const { profile } = useProfile()
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <div className="footer-name">{profile.name || 'Harshrajsinh Dodiya'}</div>
          <div className="footer-role" style={{ marginTop: '4px' }}>UI/UX Designer — Crafting with purpose</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
          {socials
            .filter(s => s.is_visible)
            .map(s => (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-role"
                style={{
                  transition: 'color 0.2s ease',
                  fontSize: 'var(--text-sm)',
                  fontWeight: '500',
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseLeave={e => e.currentTarget.style.color = ''}
              >
                {s.platform}
              </a>
            ))}
        </div>

        <div className="footer-copy">
          © {year} · Made with care
        </div>
      </div>
    </footer>
  )
}
