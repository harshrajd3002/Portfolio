import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export const PLACEHOLDER_EXPERIENCE = [
  {
    id: 1,
    organization: 'Nexus Digital Studio',
    role: 'Senior UI/UX Designer',
    duration_start: '2023-06-01',
    duration_end: null,
    is_current: true,
    location: 'Remote',
    responsibilities: [
      'Led end-to-end UX for 3 enterprise SaaS products',
      'Built and maintained a cross-platform design system used by 4 engineering teams',
      'Established UX research practice with regular usability testing cycles',
      'Mentored 2 junior designers through weekly design critiques',
    ],
    key_contribution: 'Redesigned the core dashboard experience, reducing time-on-task by 40%',
    outcome: 'Product NPS improved from 32 to 61 after the redesign shipped',
    display_order: 1,
  },
  {
    id: 2,
    organization: 'Pixel Craft Agency',
    role: 'UI/UX Designer',
    duration_start: '2021-09-01',
    duration_end: '2023-05-31',
    is_current: false,
    location: 'Ahmedabad, India',
    responsibilities: [
      'Designed mobile and web interfaces for 12+ clients across fintech, health, and e-commerce',
      'Ran discovery workshops and user interviews for client projects',
      'Created high-fidelity prototypes for investor presentations',
      'Collaborated closely with development teams in Agile sprints',
    ],
    key_contribution: 'Led the UI redesign of a fintech app that secured Series A funding',
    outcome: 'Agency won "Best Digital Agency" award for work completed during tenure',
    display_order: 2,
  },
  {
    id: 3,
    organization: 'Freelance',
    role: 'UX/UI Designer',
    duration_start: '2020-01-01',
    duration_end: '2021-08-31',
    is_current: false,
    location: 'Remote',
    responsibilities: [
      'Delivered end-to-end design for 8+ independent client projects',
      'Specialized in early-stage startups needing product-market fit validation',
      'Designed landing pages, onboarding flows, and product interfaces',
    ],
    key_contribution: 'Helped 3 startups validate their MVP concepts through clickable prototypes',
    outcome: 'Two clients successfully raised pre-seed funding using prototypes',
    display_order: 3,
  },
]

export const PLACEHOLDER_SKILLS = [
  { id: 1, name: 'UI Design', category: 'design', display_order: 1 },
  { id: 2, name: 'UX Design', category: 'design', display_order: 2 },
  { id: 3, name: 'Interaction Design', category: 'design', display_order: 3 },
  { id: 4, name: 'Visual Design', category: 'design', display_order: 4 },
  { id: 5, name: 'Design Systems', category: 'design', display_order: 5 },
  { id: 6, name: 'Prototyping', category: 'design', display_order: 6 },
  { id: 7, name: 'User Research', category: 'ux', display_order: 1 },
  { id: 8, name: 'User Flows', category: 'ux', display_order: 2 },
  { id: 9, name: 'Information Architecture', category: 'ux', display_order: 3 },
  { id: 10, name: 'Wireframing', category: 'ux', display_order: 4 },
  { id: 11, name: 'Usability Testing', category: 'ux', display_order: 5 },
  { id: 12, name: 'Journey Mapping', category: 'ux', display_order: 6 },
  { id: 13, name: 'Figma', category: 'tools', display_order: 1 },
  { id: 14, name: 'FigJam', category: 'tools', display_order: 2 },
  { id: 15, name: 'Adobe XD', category: 'tools', display_order: 3 },
  { id: 16, name: 'Illustrator', category: 'tools', display_order: 4 },
  { id: 17, name: 'Photoshop', category: 'tools', display_order: 5 },
  { id: 18, name: 'HTML / CSS', category: 'tools', display_order: 6 },
  { id: 19, name: 'Maze', category: 'tools', display_order: 7 },
  { id: 20, name: 'Notion', category: 'tools', display_order: 8 },
]

export const PLACEHOLDER_EDUCATION = [
  {
    id: 1,
    degree: 'Bachelor of Design',
    institution: 'National Institute of Design',
    duration_start: '2017-07-01',
    duration_end: '2021-05-31',
    relevant_areas: ['Visual Communication', 'Human-Computer Interaction', 'Typography', 'Product Design'],
    achievements: 'Graduated with distinction. Final thesis on accessibility in public digital kiosks.',
    display_order: 1,
  },
]

export const PLACEHOLDER_CERTIFICATIONS = [
  {
    id: 1,
    name: 'Google UX Design Certificate',
    organization: 'Google',
    issue_date: '2022-04-01',
    credential_url: 'https://coursera.org/verify/example',
    certificate_image_url: null,
    display_order: 1,
  },
  {
    id: 2,
    name: 'Interaction Design Specialization',
    organization: 'UC San Diego / Coursera',
    issue_date: '2021-11-01',
    credential_url: 'https://coursera.org/verify/example2',
    certificate_image_url: null,
    display_order: 2,
  },
  {
    id: 3,
    name: 'Figma Advanced Design Systems',
    organization: 'Figma',
    issue_date: '2023-02-01',
    credential_url: null,
    certificate_image_url: null,
    display_order: 3,
  },
]

export const PLACEHOLDER_SOCIAL = [
  { id: 1, platform: 'LinkedIn', url: 'https://linkedin.com/in/harshrajsinh', display_order: 1, is_visible: true },
  { id: 2, platform: 'Figma', url: 'https://figma.com/@harshrajsinh', display_order: 2, is_visible: true },
  { id: 3, platform: 'Dribbble', url: 'https://dribbble.com/harshrajsinh', display_order: 3, is_visible: true },
  { id: 4, platform: 'Behance', url: 'https://behance.net/harshrajsinh', display_order: 4, is_visible: true },
  { id: 5, platform: 'Instagram', url: 'https://instagram.com/harshrajsinh', display_order: 5, is_visible: true },
]

function useSingleTable(table, placeholder, orderBy = 'display_order') {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = async () => {
    setLoading(true)
    try {
      const { data: rows, error } = await supabase
        .from(table)
        .select('*')
        .order(orderBy, { ascending: true })
      if (error) throw error
      setData(rows || [])
    } catch (err) {
      setError(err.message)
      setData(placeholder)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [table])

  const create = async (values) => {
    const { data: created, error } = await supabase.from(table).insert(values).select().single()
    if (error) throw error
    return created
  }

  const update = async (id, values) => {
    const { data: updated, error } = await supabase.from(table).update(values).eq('id', id).select().single()
    if (error) throw error
    return updated
  }

  const remove = async (id) => {
    const { error } = await supabase.from(table).delete().eq('id', id)
    if (error) throw error
  }

  return { data, loading, error, refresh: fetch, create, update, remove }
}

export function useExperience() {
  return useSingleTable('experience', PLACEHOLDER_EXPERIENCE)
}

export function useSkills() {
  return useSingleTable('skills', PLACEHOLDER_SKILLS, 'display_order')
}

export function useEducation() {
  return useSingleTable('education', PLACEHOLDER_EDUCATION)
}

export function useCertifications() {
  return useSingleTable('certifications', PLACEHOLDER_CERTIFICATIONS)
}

export function useSocialLinks() {
  return useSingleTable('social_links', PLACEHOLDER_SOCIAL)
}
