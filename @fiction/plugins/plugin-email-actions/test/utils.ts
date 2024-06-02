import { replace } from 'lodash'
import type { EmailVars } from '../action'

// Helper function to escape regex special characters
function escapeRegExp(text: string): string {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}

// Function to safely replace text and its URL-encoded version only if it exists and is not empty
function safeReplace(str: string, pattern: string | undefined, replacement: string): string {
  if (!pattern)
    return str
  const escapedPattern = escapeRegExp(pattern)
  const urlEncodedPattern = encodeURIComponent(pattern)
  str = str.replace(new RegExp(escapedPattern, 'g'), replacement)
  return str.replace(new RegExp(escapeRegExp(urlEncodedPattern), 'g'), replacement)
}

export function emailActionSnapshot(str: string, emailVars: Partial<EmailVars> = {}, masks?: Record<string, string>): string {
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

  if (masks) {
    // Mask other information
    for (const [key, value] of Object.entries(masks)) {
      str = safeReplace(str, value, `[${key}]`)
    }
  }

  return str
}
