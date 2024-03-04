import path from 'node:path'
import process from 'node:process'
import { type FictionApp, type FictionMedia, toCamel } from '@fiction/core'
import fs from 'fs-extra'

export function cdnUrl(args: { assetName: string, fictionApp: FictionApp }): string {
  const { assetName, fictionApp: _ } = args
  return `https://supereon-media.s3.us-west-2.amazonaws.com/assets/${assetName}`
}

export function imageUrl(url: URL): string {
  return url.toString().replace('file://', '/@fs')
}

export function incrementSlugId(slug?: string): string {
  if (!slug)
    return 'view-1'

  // Append '-1' if slug is purely numeric
  if (/^\d+$/.test(slug))
    return `${slug}-1`

  const parts = slug.split('-')
  const lastPart = parts.pop() as string
  const lastNumber = Number.parseInt(lastPart)

  // Special handling for negative numbers
  if (lastPart.startsWith('-') && !Number.isNaN(lastNumber))
    return `${parts.join('-')}-${(lastNumber + 1).toString()}`

  // If lastPart is a number, increment it, else append '1'
  parts.push(!Number.isNaN(lastNumber) ? `${lastNumber + 1}` : (lastPart ? `${lastPart}-1` : '1'))

  return parts.join('-')
}

/**
 * When themes are created, they are stored in the database as a JSON object.
 * This function converts local file paths to URLs for media objects.
 * These objects are more robust and universal/CDN based
 * than the convenient local file paths used in themes statically
 */
export async function processUrlKey(args: {
  fictionMedia: FictionMedia
  url: string
  orgId: string
  userId: string
  storagePath?: string
}): Promise<string> {
  const { fictionMedia, url, userId, orgId, storagePath } = args

  // Check for a valid URL and if running in a Node.js environment
  if (url && typeof process !== 'undefined' && process.cwd) {
    try {
      // Parse the URL and replace the hostname with process.cwd()
      const parsedUrl = new URL(url, 'http://dummybase')
      const filePath = parsedUrl.protocol === 'file:'
        ? url.replace('file://', '')
        : parsedUrl.pathname.includes('@fs')
          ? parsedUrl.pathname.replace('/@fs', '')
          : path.join(process.cwd(), parsedUrl.pathname)

      // Check if the file exists at the new path
      const exists = await fs.exists(filePath)

      if (!exists)
        return url

      // If file exists, proceed with media object creation
      const r = await fictionMedia.queries.ManageMedia.serve({
        _action: 'checkAndCreate',
        orgId,
        userId,
        fields: { filePath },
        storagePath,
      }, { server: true })

      const media = r.data

      return media?.url || url
    }
    catch (error) {
      const e = error as Error
      // In case of any error, return the original obj
      fictionMedia.log.error(e.message, { error: e })
      return url
    }
  }
  else {
    // If URL is invalid or not running in Node.js, return the original url
    return url
  }
}

export const iconStyle = {
  primary: { color: 'text-primary-500 dark:text-primary-200', bg: 'bg-primary-50 dark:bg-primary-950', border: 'border-primary-200 dark:border-primary-700', borderActive: 'border-primary-300 dark:border-primary-600' },
  theme: { color: 'text-theme-500 dark:text-theme-200', bg: 'bg-theme-50 dark:bg-theme-900', border: 'border-theme-200 dark:border-theme-500', borderActive: 'border-theme-300 dark:border-theme-500' },
  rose: { color: 'text-rose-500 dark:text-rose-200', bg: 'bg-rose-50 dark:bg-rose-900', border: 'border-rose-200 dark:border-rose-600', borderActive: 'border-rose-300 dark:border-rose-600' },
  emerald: { color: 'text-emerald-500 dark:text-emerald-200', bg: 'bg-emerald-50 dark:bg-emerald-900', border: 'border-emerald-200 dark:border-emerald-600', borderActive: 'border-emerald-300 dark:border-emerald-600' },
  blue: { color: 'text-blue-500 dark:text-blue-200', bg: 'bg-blue-50 dark:bg-blue-900', border: 'border-blue-200 dark:border-blue-600', borderActive: 'border-blue-300 dark:border-blue-600' },
  indigo: { color: 'text-indigo-500 dark:text-indigo-200', bg: 'bg-indigo-50 dark:bg-indigo-900', border: 'border-indigo-200 dark:border-indigo-600', borderActive: 'border-indigo-300 dark:border-indigo-600' },
  purple: { color: 'text-purple-500 dark:text-purple-200', bg: 'bg-purple-50 dark:bg-purple-900', border: 'border-purple-200 dark:border-purple-600', borderActive: 'border-purple-300 dark:border-purple-600' },
  pink: { color: 'text-pink-500 dark:text-pink-200', bg: 'bg-pink-50 dark:bg-pink-900', border: 'border-pink-200 dark:border-pink-600', borderActive: 'border-pink-300 dark:border-pink-600' },
  orange: { color: 'text-orange-500 dark:text-orange-200', bg: 'bg-orange-50 dark:bg-orange-900', border: 'border-orange-200 dark:border-orange-600', borderActive: 'border-orange-300 dark:border-orange-600' },
  yellow: { color: 'text-yellow-500 dark:text-yellow-200', bg: 'bg-yellow-50 dark:bg-yellow-900', border: 'border-yellow-200 dark:border-yellow-600', borderActive: 'border-yellow-300 dark:border-yellow-600' },
  green: { color: 'text-green-500 dark:text-green-200', bg: 'bg-green-50 dark:bg-green-900', border: 'border-green-200 dark:border-green-600', borderActive: 'border-green-300 dark:border-green-600' },
  red: { color: 'text-red-500 dark:text-red-200', bg: 'bg-red-50 dark:bg-red-900', border: 'border-red-200 dark:border-red-700', borderActive: 'border-red-300 dark:border-red-800' },
  gray: { color: 'text-gray-500 dark:text-gray-200', bg: 'bg-gray-50 dark:bg-gray-900', border: 'border-gray-200 dark:border-gray-700', borderActive: 'border-gray-300 dark:border-gray-800' },
  coolGray: { color: 'text-cool-gray-500 dark:text-cool-gray-200', bg: 'bg-cool-gray-50 dark:bg-cool-gray-900', border: 'border-cool-gray-200 dark:border-cool-gray-700', borderActive: 'border-cool-gray-300 dark:border-cool-gray-800' },
  trueGray: { color: 'text-true-gray-500 dark:text-true-gray-200', bg: 'bg-true-gray-50 dark:bg-true-gray-900', border: 'border-true-gray-200 dark:border-true-gray-700', borderActive: 'border-true-gray-300 dark:border-true-gray-800' },
  warmGray: { color: 'text-warm-gray-500 dark:text-warm-gray-200', bg: 'bg-warm-gray-50 dark:bg-warm-gray-900', border: 'border-warm-gray-200 dark:border-warm-gray-700', borderActive: 'border-warm-gray-300 dark:border-warm-gray-800' },
  cyan: { color: 'text-cyan-500 dark:text-cyan-200', bg: 'bg-cyan-50 dark:bg-cyan-900', border: 'border-cyan-200 dark:border-cyan-700', borderActive: 'border-cyan-300 dark:border-cyan-800' },
  lightBlue: { color: 'text-light-blue-500 dark:text-light-blue-200', bg: 'bg-light-blue-50 dark:bg-light-blue-900', border: 'border-light-blue-200 dark:border-light-blue-700', borderActive: 'border-light-blue-300 dark:border-light-blue-800' },
  lime: { color: 'text-lime-500 dark:text-lime-200', bg: 'bg-lime-50 dark:bg-lime-900', border: 'border-lime-200 dark:border-lime-700', borderActive: 'border-lime-300 dark:border-lime-800' },
  amber: { color: 'text-amber-500 dark:text-amber-200', bg: 'bg-amber-50 dark:bg-amber-900', border: 'border-amber-200 dark:border-amber-700', borderActive: 'border-amber-300 dark:border-amber-800' },
  teal: { color: 'text-teal-500 dark:text-teal-200', bg: 'bg-teal-50 dark:bg-teal-900', border: 'border-teal-200 dark:border-teal-700', borderActive: 'border-teal-300 dark:border-teal-800' },
  sky: { color: 'text-sky-500 dark:text-sky-200', bg: 'bg-sky-50 dark:bg-sky-900', border: 'border-sky-200 dark:border-sky-700', borderActive: 'border-sky-300 dark:border-sky-800' },
  violet: { color: 'text-violet-500 dark:text-violet-200', bg: 'bg-violet-50 dark:bg-violet-900', border: 'border-violet-200 dark:border-violet-700', borderActive: 'border-violet-300 dark:border-violet-800' },
  fuchsia: { color: 'text-fuchsia-500 dark:text-fuchsia-200', bg: 'bg-fuchsia-50 dark:bg-fuchsia-900', border: 'border-fuchsia-200 dark:border-fuchsia-700', borderActive: 'border-fuchsia-300 dark:border-fuchsia-800' },
}

export function extractIdFromUrl(url: string): { themeId?: string, siteId?: string, subDomain?: string } {
  const result: { themeId?: string, siteId?: string, subDomain?: string } = {}
  const urlObject = new URL(url)
  const pathSegments = urlObject.pathname.split('/').filter(segment => segment)

  const validKeys = new Set(['themeId', 'siteId', 'subDomain'])

  for (let i = 0; i < pathSegments.length; i += 2) {
    const key = toCamel(pathSegments[i])
    if (validKeys.has(key) && pathSegments[i + 1])
      result[key as keyof typeof result] = pathSegments[i + 1]
  }

  return result
}
