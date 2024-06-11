import path from 'node:path'
import process from 'node:process'
import fs from 'fs-extra'
import type { GradientSetting, ImageFilter } from '../types/index.js'
import type { FictionMedia, TableMediaConfig } from './index.js'

type RelativeMediaArgs = {
  fictionMedia: FictionMedia
  url: string
  orgId?: string
  userId?: string
  cache: Record<string, TableMediaConfig>
}

const encodedFilePath = (filePath: string): string => path.join(path.dirname(filePath), encodeURIComponent(path.basename(filePath)))

export async function relativeMedia(args: RelativeMediaArgs): Promise<TableMediaConfig> {
  const { fictionMedia, url, userId, orgId, cache } = args

  // Return the cached URL if it exists
  if (cache[url])
    return cache[url]

  // Validate URL and check the running environment
  if (!url || !fictionMedia.fictionEnv?.isNode)
    return { url } // Return the original URL if invalid environment

  try {
    // encode file path in case file name is weird
    const parsedUrl = new URL(encodedFilePath(url), 'http://dummybase')
    const filePath = url.includes('file://')
      ? url.replace('file://', '')
      : parsedUrl.pathname.includes('@fs')
        ? parsedUrl.pathname.replace('/@fs', '')
        : path.join(process.cwd(), decodeURIComponent(parsedUrl.pathname).replace(process.cwd(), ''))

    // Check file existence with proper error handling
    try {
      await fs.access(filePath)
    }
    catch {
      fictionMedia.log.error('relativeMedia: File not found', { data: { filePath, url } })
      return { url } // Return original URL if file doesn't exist
    }

    // Handle media creation or retrieval
    const mediaResponse = await fictionMedia.queries.ManageMedia.serve({
      _action: 'checkAndCreate',
      orgId,
      userId,
      fields: { filePath },
      storageGroupPath: 'fiction-relative-media',
    }, { server: true })

    // Cache and return the new or existing media URL
    const newMedia = mediaResponse.data || { url }
    cache[url] = newMedia
    return newMedia
  }
  catch (error) {
    fictionMedia.log.error('Error processing URL', { error })
    return { url } // Return original URL in case of error
  }
}

export function getGradientCss(gradient?: GradientSetting, options?: { noAngle?: boolean }): string {
  const { noAngle } = options || {}
  if (!gradient?.stops)
    return ''

  const st = gradient.stops.map(i => i.color).filter(Boolean)

  // to force render if only one stop
  if (st.length === 1)
    st.push(st[0])

  const li = st.join(', ')

  const angle = noAngle || !gradient.angle ? 90 : gradient.angle
  return li ? `linear-gradient(${angle}deg, ${li})` : ''
}

export function getImageFilter(f: ImageFilter, a?: number): string {
  if (a === undefined)
    return ''

  let v: string = ''
  if (f === 'blur')
    v = `blur(${(a / 100) * 10}px)`
  else if (f === 'opacity')
    v = `opacity(${a / 100})`
  else if (f === 'grayscale')
    v = `grayscale(${a / 100})`
  else if (f === 'invert')
    v = `invert(${a / 100})`
  else if (f === 'sepia')
    v = `sepia(${a / 100})`
  else if (f === 'brightness')
    v = `brightness(${(a / 100) * 2})`
  else if (f === 'saturate')
    v = `saturate(${(a / 100) * 2})`
  else if (f === 'hue-rotate')
    v = `hue-rotate(${(a / 100) * 360}deg)`
  else if (f === 'contrast')
    v = `contrast(${(a / 100) * 2})`

  return v
}
