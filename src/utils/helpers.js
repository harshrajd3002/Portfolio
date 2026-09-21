/**
 * Format a date string to "Month Year"
 */
export function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

/**
 * Format a duration range
 */
export function formatDuration(start, end, isCurrent = false) {
  const s = formatDate(start)
  const e = isCurrent ? 'Present' : formatDate(end)
  return `${s} — ${e}`
}

/**
 * Slugify a string for URLs
 */
export function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Clamp a number between min and max
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

/**
 * Truncate text with ellipsis
 */
export function truncate(str, maxLen = 120) {
  if (!str || str.length <= maxLen) return str
  return str.slice(0, maxLen).trim() + '…'
}

/**
 * Check if the user prefers reduced motion
 */
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
