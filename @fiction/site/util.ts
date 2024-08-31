import path from 'node:path'
import process from 'node:process'
import { type FictionApp, type FictionMedia, toCamel } from '@fiction/core/index.js'
import fs from 'fs-extra'

export function cdnUrl(args: { assetName: string, fictionApp: FictionApp }): string {
  const { assetName, fictionApp: _ } = args
  return `https://supereon-media.s3.us-west-2.amazonaws.com/assets/${assetName}`
}

export function imageUrl(url: URL): string {
  return url.toString().replace('file://', '/@fs')
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
  storageGroupPath?: string
}): Promise<string> {
  const { fictionMedia, url, userId, orgId, storageGroupPath } = args

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
        storageGroupPath,
      }, { server: true })

      const media = r.data?.[0]

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

export const imageStyle = [
  { category: 'realismAndDetail', name: 'Realistic', value: 'Cinematic High-resolution, lifelike detail and vivid colors. Sigma 85 mm f/1.4. High Definition, Bokeh.' },
  { category: 'realismAndDetail', name: 'Grayscale', value: 'Black and white, contrast and texture inspired by classical photography, cubism, and suprematism. Kazimir Malevich. Pablo Picasso.' },

  { category: 'designAndArt', name: 'Minimalist', value: 'Simple design with monochrome or limited palettes. Artists: Donald Judd, Agnes Martin.' },
  { category: 'designAndArt', name: 'Abstract', value: 'Bold shapes, expressive lines, and minimal colors. Artists: Wassily Kandinsky, Piet Mondrian.' },
  { category: 'designAndArt', name: 'Hand-drawn', value: 'Whimsical, friendly style mimicking hand-drawn sketches. Artists: Quentin Blake, Saul Steinberg.' },
  { category: 'designAndArt', name: 'Watercolor', value: 'Fluid, soft appearance with translucent pastel shades. Artists: John Singer Sargent, Albrecht Dürer.' },

  { category: 'timeAndAesthetic', name: 'Vintage', value: 'Aged effects, classic designs, and sepia tones. Artists: Steichen Edward, Alfred Stieglitz.' },
  { category: 'timeAndAesthetic', name: 'Americana', value: 'Nostalgic, featuring classic, rustic American themes. Artists: Norman Rockwell, Grant Wood.' },
  { category: 'timeAndAesthetic', name: 'Retro-Futurism', value: 'Nostalgic styles blended with futuristic concepts. Artists: Syd Mead, Ralph McQuarrie.' },

  { category: 'natureAndExploration', name: 'Nature', value: 'Green, serene visuals emphasizing eco-friendly themes. Artists: Ansel Adams, Georgia O’Keeffe.' },
  { category: 'natureAndExploration', name: 'Adventure', value: 'Excitement and exploration with dynamic visuals. Artists: Thomas Cole, Frederic Edwin Church.' },
  { category: 'natureAndExploration', name: 'Urban', value: 'Modern city life, architectural and street elements. Artists: Edward Hopper, Richard Estes.' },

  { category: 'fantasyAndSciFi', name: 'Fantasy', value: 'Enchanting landscapes, lush nature, and magical themes. Artists: Brian Froud, John Howe.' },
  { category: 'fantasyAndSciFi', name: 'Hi-Tech', value: 'Cutting-edge technology with a futuristic vibe. Artists: Chris Foss, H.R. Giger.' },
  { category: 'fantasyAndSciFi', name: 'Cyberpunk', value: 'Neon-lit, high-tech urban dystopia. Artists: Gregory Stoffel, Andrzej Marszalek, Juan P. Osorio' },

  { category: 'luxuryAndGlamour', name: 'Luxury', value: 'Opulence, lavish textures, and rich colors. Artists: Gustav Klimt, Peter Paul Rubens.' },
  { category: 'luxuryAndGlamour', name: 'Glamour', value: 'Alluring, sophisticated visuals with a glossy finish. Artists: George Hurrell, Cecil Beaton.' },
  { category: 'luxuryAndGlamour', name: 'High Fashion', value: 'Cutting-edge fashion, luxury, and exclusivity. Artists: Mario Testino, Annie Leibovitz.' },

  { category: 'professionalAndCorporate', name: 'Corporate', value: 'Sleek, professional imagery for business. Artists: Andreas Gursky, Candida Höfer.' },
  { category: 'professionalAndCorporate', name: 'Professional', value: 'Formality, refinement with crisp, smart designs. Artists: Yves Béhar, Dieter Rams.' },

  // Adding more styles
  { category: 'expressiveAndEmotive', name: 'Expressionism', value: 'Intense, emotional expression through bold colors and dramatic compositions. Artists: Edvard Munch, Egon Schiele.' },
  { category: 'surrealAndDreamlike', name: 'Surrealism', value: 'Dreamlike scenes with surprising, often illogical elements. Artists: Salvador Dalí, René Magritte.' },
  { category: 'popAndCulture', name: 'Pop Art', value: 'Bold, colorful imagery of popular culture and mass media. Artists: Andy Warhol, Roy Lichtenstein.' },
  { category: 'culturalAndHistorical', name: 'Classical', value: 'Inspired by Ancient Greece and the Renaissance. Artists: Leonardo da Vinci, Michelangelo.' },
]

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
