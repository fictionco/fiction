const TEXT_FIELDS = [
  'title',
  'subTitle',
  'content',
  'description',
  'label',
  'subLabel',
  'text',
  'placeholder',
  'excerpt',
  'body',
  'name',
] as const

// Fields that contain taxonomy arrays
const TAXONOMY_FIELDS = [
  'tags',
  'categories',
  'topics',
  'keywords',
] as const

/**
 * Count words in a string, handling HTML and common punctuation
 */
export function countWords(text: string): number {
  if (!text)
    return 0
  // Strip HTML tags
  const strippedHtml = text.replace(/<[^>]*>/g, ' ')
  // Split on whitespace and filter empty strings
  return strippedHtml
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0)
    .length
}

/**
 * Recursively get word count from an object's text fields
 */
export function getObjectWordCount(obj: Record<string, any>, opts: { addFields?: string[], ignoreKeys?: string[] } = {}): number {
  if (!obj)
    return 0

  const allTextFields = [...TEXT_FIELDS, ...(opts.addFields || [])]

  return Object.entries(obj).reduce((count, [key, value]) => {
    // Ignore specified keys
    if (opts.ignoreKeys && opts.ignoreKeys.includes(key))
      return count

    // Handle taxonomy arrays
    if (TAXONOMY_FIELDS.includes(key as typeof TAXONOMY_FIELDS[number]) && Array.isArray(value)) {
      return count + value.reduce((sum, term) => sum + (typeof term === 'string' ? countWords(term) : 0), 0)
    }

    // Handle other arrays recursively
    if (Array.isArray(value)) {
      return count + value.reduce((sum, item) => {
        return sum + (typeof item === 'object' ? getObjectWordCount(item, opts) : 0)
      }, 0)
    }

    // Handle nested objects recursively
    if (value && typeof value === 'object') {
      return count + getObjectWordCount(value, opts)
    }

    // Count words if field name matches and value is string
    if (allTextFields.includes(key) && typeof value === 'string' && value.length > 0) {
      return count + countWords(value)
    }

    return count
  }, 0)
}
