import { supabase } from './supabase'

/**
 * Upload a file to Supabase Storage and return the public URL.
 * @param {File} file - The file to upload
 * @param {string} bucket - Storage bucket name
 * @param {string} folder - Folder path inside bucket
 * @returns {Promise<string>} Public URL of the uploaded file
 */
export async function uploadFile(file, bucket = 'portfolio', folder = 'images') {
  const ext = file.name.split('.').pop()
  const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filename, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) throw error

  const { data } = supabase.storage.from(bucket).getPublicUrl(filename)
  return data.publicUrl
}

/**
 * Delete a file from Supabase Storage by its public URL.
 */
export async function deleteFile(url, bucket = 'portfolio') {
  // Extract path from URL
  const urlObj = new URL(url)
  const path = urlObj.pathname.split(`/storage/v1/object/public/${bucket}/`)[1]
  if (!path) return

  const { error } = await supabase.storage.from(bucket).remove([path])
  if (error) throw error
}
