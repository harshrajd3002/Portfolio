import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export const PLACEHOLDER_PROJECTS = [
  {
    id: 1,
    title: 'Luminary Banking App',
    slug: 'luminary-banking-app',
    category: 'Mobile App',
    short_description: 'Reimagining personal finance for Gen Z — making money management feel less intimidating and more empowering.',
    role: 'Lead UX Designer',
    thumbnail_url: null,
    images: [],
    tools: ['Figma', 'FigJam', 'Maze'],
    problem: 'Young adults struggle to engage with traditional banking apps that feel designed for older generations. Complex interfaces lead to financial anxiety rather than empowerment.',
    process: 'Started with 20+ user interviews across age 18–26. Identified key friction points: confusing transaction history, lack of financial literacy guidance, and overwhelming notifications.',
    solution: 'Designed a progressive disclosure system where complexity reveals only when needed. Created a financial insights layer that educates without lecturing.',
    outcome: 'Prototype tested with 40 users showed 78% improvement in task completion rate and significantly reduced cognitive load scores.',
    live_url: null,
    featured: true,
    display_order: 1,
    published: true,
  },
  {
    id: 2,
    title: 'Meridian Design System',
    slug: 'meridian-design-system',
    category: 'Design System',
    short_description: 'A comprehensive component library and design language built to unify a fragmented product ecosystem across 6 platforms.',
    role: 'Design System Lead',
    thumbnail_url: null,
    images: [],
    tools: ['Figma', 'Storybook', 'Zeplin'],
    problem: 'A fast-growing SaaS company had inconsistent UI across web, iOS, Android, and 3 internal tools. Every new feature required re-solving the same design problems.',
    process: 'Conducted a full UI audit across all platforms. Identified 40+ component variations that could be unified into 12 core components. Established token-first architecture.',
    solution: 'Built a 3-tier design system: tokens → components → patterns. Created living documentation with interactive component states and usage guidelines.',
    outcome: 'Reduced design-to-development handoff time by 60%. New screens now take 2 days instead of 2 weeks to design.',
    live_url: null,
    featured: true,
    display_order: 2,
    published: true,
  },
  {
    id: 3,
    title: 'Kira Health Platform',
    slug: 'kira-health-platform',
    category: 'Web App',
    short_description: 'A patient-centered mental health platform that bridges the gap between therapy sessions with daily check-ins and mood tracking.',
    role: 'UX/UI Designer',
    thumbnail_url: null,
    images: [],
    tools: ['Figma', 'UserTesting', 'Hotjar'],
    problem: 'Mental health support traditionally stops at the therapy session. Users had no structured way to track their progress or maintain insights between sessions.',
    process: 'Worked closely with licensed therapists to understand clinical requirements. Co-designed with users through 3 rounds of participatory design workshops.',
    solution: 'Created a gentle, non-clinical interface with daily mood check-ins, journaling prompts, and therapist-shared resources. Privacy-first architecture.',
    outcome: 'Beta users reported 65% higher engagement with therapeutic homework. 4.8/5 usability score from accessibility-focused testing.',
    live_url: null,
    featured: false,
    display_order: 3,
    published: true,
  },
]

export function useProjects({ featuredOnly = false, slug = null } = {}) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchProjects() {
      try {
        let query = supabase
          .from('projects')
          .select('*')
          .eq('published', true)
          .order('display_order', { ascending: true })

        if (featuredOnly) query = query.eq('featured', true)
        if (slug) query = query.eq('slug', slug).single()

        const { data, error } = await query
        if (error) throw error
        if (data) setProjects(slug ? [data] : data)
      } catch (err) {
        setError(err.message)
        // Fallback to placeholder
        let fallback = PLACEHOLDER_PROJECTS
        if (featuredOnly) fallback = fallback.filter(p => p.featured)
        if (slug) fallback = fallback.filter(p => p.slug === slug)
        setProjects(fallback)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [featuredOnly, slug])

  // Admin CRUD
  const createProject = async (data) => {
    const { data: created, error } = await supabase.from('projects').insert(data).select().single()
    if (error) throw error
    return created
  }

  const updateProject = async (id, data) => {
    const { data: updated, error } = await supabase.from('projects').update(data).eq('id', id).select().single()
    if (error) throw error
    return updated
  }

  const deleteProject = async (id) => {
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) throw error
  }

  return { projects, loading, error, createProject, updateProject, deleteProject }
}

export function useAllProjectsAdmin() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true })
      if (error) throw error
      setProjects(data || [])
    } catch (err) {
      setError(err.message)
      setProjects(PLACEHOLDER_PROJECTS)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [])

  return { projects, loading, error, refresh: fetch }
}
