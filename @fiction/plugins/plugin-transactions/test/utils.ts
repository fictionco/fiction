import type { EmailVars } from '../action'

// Utility function to escape special characters in a regex pattern
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

// Function to safely replace text and its URL-encoded version only if it exists and is not empty
function safeReplace(str: string, pattern: string | undefined, replacement: string): string {
  if (!pattern)
    return str

  // Escape the pattern for regex
  const escapedPattern = escapeRegExp(pattern)

  // Encode the pattern as it would be in a query string
  const urlSearchParams = new URLSearchParams()
  urlSearchParams.append('key', pattern) // 'key' is arbitrary here
  const urlEncodedPattern = urlSearchParams.toString().split('=')[1]

  // Replace all occurrences of the pattern with the replacement
  str = str.replace(new RegExp(escapedPattern, 'g'), replacement)
  // Replace all occurrences of the URL-encoded pattern with the replacement
  str = str.replace(new RegExp(escapeRegExp(urlEncodedPattern), 'g'), replacement)

  return str
}

export function emailActionSnapshot(str: string, emailVars: Partial<EmailVars> = {}, masks?: Record<string, string | undefined>): string {
  const { token, email, code, userId, username, callbackUrl, originUrl, unsubscribeUrl, fullName } = emailVars

  // Function to replace port numbers in URLs
  const replacePortInUrl = (url: string) => url.replace(/:(\d+)/, ':[port]')

  // Perform replacements only if variables are defined and non-empty
  str = safeReplace(str, token, '[token]')
  str = safeReplace(str, email, '[email]')
  str = safeReplace(str, code, `[code]`)
  str = safeReplace(str, userId, '[userId]')
  str = safeReplace(str, username, '[username]')
  str = safeReplace(str, fullName, '[fullName]')
  str = callbackUrl ? safeReplace(str, callbackUrl, replacePortInUrl(callbackUrl)) : str
  str = originUrl ? safeReplace(str, originUrl, replacePortInUrl(originUrl)) : str
  str = unsubscribeUrl ? safeReplace(str, unsubscribeUrl, replacePortInUrl(unsubscribeUrl)) : str

  const m = { ...emailVars.masks, ...masks }
  if (m) {
    // Mask other information
    for (const [key, value] of Object.entries(m)) {
      if (value) {
        str = safeReplace(str, value, `[${key}]`)
      }
    }
  }

  return str
}
