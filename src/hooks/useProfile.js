import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

// Placeholder data shown when Supabase is not configured
export const PLACEHOLDER_PROFILE = {
  id: 1,
  name: 'Harshrajsinh Dodiya',
  headline: 'UI/UX Designer',
  bio: 'I design digital products that are <strong>clear, purposeful, and human</strong>. I believe the best design is the kind people don\'t notice — it just works.',
  philosophy: 'Design is not how it looks. It\'s how it works, how it feels, and what it makes someone do next.',
  currently_exploring: ['Interaction Design Patterns', 'Design Systems', 'Motion Design', 'Accessibility'],
  profile_image_url: null,
  email: 'harshrajsinh@example.com',
  resume_url: null,
}

export function useProfile() {
  const [profile, setProfile] = useState(PLACEHOLDER_PROFILE)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data, error } = await supabase
          .from('profile')
          .select('*')
          .single()

        if (error) throw error
        if (data) setProfile(data)
      } catch (err) {
        setError(err.message)
        // Keep placeholder on error
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const updateProfile = async (updates) => {
    const { data, error } = await supabase
      .from('profile')
      .upsert({ id: 1, ...updates })
      .select()
      .single()

    if (error) throw error
    setProfile(data)
    return data
  }

  return { profile, loading, error, updateProfile }
}
