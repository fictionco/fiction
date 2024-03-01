import stopwordsLib from '../resource/stopwords'

export function toCamel(str: string): string {
  return str
    // Handle non-word characters (spaces, hyphens, underscores)
    .replace(/[_-\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
    // Ensure the first character is lowercase
    .replace(/^./, c => c.toLowerCase())
}

/**
 * Converts regular space delimited text into a hyphenated slug
 */
export function toSlug(text: string | undefined, options?: { maintainCase?: boolean, replaceNumbers?: boolean }): string {
  const { maintainCase = false, replaceNumbers = true } = options || {}

  if (!text)
    return ''

  // Insert hyphens before uppercase letters in camelCase or PascalCase words
  // and convert the entire string to lowercase if the lowercase option is true
  if (!maintainCase)
    text = text.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()

  // Normalize Unicode characters
  text = text.normalize('NFD').replace(/[\u0300-\u036F]/g, '')

  if (replaceNumbers) {
    // Remove numbers and non-word characters (preserving spaces and hyphens)
    text = text.replace(/[0-9]+/g, '').replace(/[^\w\s-]+/g, '')
  }
  else {
    // Remove non-word characters except numbers (preserving spaces and hyphens)
    text = text.replace(/[^\w\s\d-]+/g, '')
  }

  // Replace spaces with a dash
  text = text.replace(/\s+/g, '-')

  // Replace multiple consecutive dashes with a single dash and trim dashes from the start and end
  return text.replace(/-+/g, '-').replace(/^-+|-+$/g, '')
}

/**
 * Make stop words lower case in a title
 */
export function stopWordLowercase(str: string, lib: string[] = stopwordsLib): string {
  const words = str.split(' ')

  return words.map((word, index) =>
    index === 0 || !lib.includes(word.toLowerCase()) ? word : word.toLowerCase(),
  ).join(' ')
}

/**
 * Coverts a slug or variable into a title-like string
 */
export function toLabel(str?: string | number): string {
  if (!str)
    return ''

  str = String(str)

  // First replace camelCase and snake_case with space-separated words
  let label = str
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Convert camelCase to space-separated words
    .replace(/_/g, ' ') // Convert snake_case to space-separated words

  // Then proceed with the original transformation
  label = label
    .replace(/-/g, ' ') // Turn dashes to spaces
    .replace(/\//g, ' ') // Remove slashes
    .replace(/\b\w/g, l => l.toUpperCase()) // Capitalize first letter of each word
    .trim()

  return stopWordLowercase(label)
}

/**
 * Converts a string ToPascalCase
 */
export function toPascal(text: string): string {
  // First, check if the string contains only non-alphanumeric characters
  if (/^[^a-zA-Z0-9]+$/.test(text))
    return ''

  return text
    // Handle camelCase by inserting a space before uppercase letters followed by lowercase letters
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    // Convert the whole string to lowercase
    .toLowerCase()
    // Convert first letter of each word to uppercase
    .replace(/(^|[^a-z0-9]+)(.)/g, (_, __, char) => char.toUpperCase())
}

export function toSnake(text: string, upper: boolean = false): string {
  const snakeCased = text
    // Insert an underscore before each uppercase letter and convert the whole string to lowercase
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    // Remove leading underscore if it exists (can happen if original string started with an uppercase letter or an underscore)
    .replace(/^_+/, '') // Use + to remove one or more leading underscores

  // Convert to uppercase if the upper option is true
  return upper ? snakeCased.toUpperCase() : snakeCased
}
