import type { Buffer } from 'node:buffer'
import path from 'node:path'
import sharp from 'sharp'

import fs from 'fs-extra'

export async function hashFile(fileInput: {
  filePath?: string
  buffer?: Buffer
}): Promise<string> {
  const { createHash } = await import('node:crypto')
  return new Promise((resolve, reject) => {
    const hash = createHash('sha256')

    const { filePath, buffer } = fileInput

    if (buffer) {
      // If a buffer is provided (e.g., from a Multer file), use it directly
      hash.update(buffer)
      resolve(hash.digest('hex'))
    }
    else if (filePath) {
      // If a file path is provided, read the file as a stream
      const stream = fs.createReadStream(filePath)

      stream.on('data', chunk => hash.update(chunk))
      stream.on('end', () => resolve(hash.digest('hex')))
      stream.on('error', err => reject(err))
    }
    else {
      // Handle the case where neither a buffer nor a path is provided
      reject(new Error('No valid file input provided'))
    }
  })
}

export async function createBlurHash(img: sharp.Sharp, meta: sharp.OutputInfo): Promise<string | undefined> {
  const { encode, isBlurhashValid } = await import('blurhash')

  const alphaImg = img.raw().ensureAlpha()
  const pixelBuffer = await alphaImg.toBuffer()

  const { width, height } = meta

  if (!width || !height) {
    console.warn('Could not create blurhash (no meta info)')
    return
  }

  const blurhash = encode(new Uint8ClampedArray(pixelBuffer), width, height, 4, 4)

  if (isBlurhashValid(blurhash))
    return blurhash
}

type ImageSizeOptions = {
  main: { width: number, height: number }
  thumbnail: { width: number, height: number }
}

export async function createImageVariants(fileSource: Buffer, options: ImageSizeOptions): Promise<{
  mainImage: sharp.Sharp
  thumbnailImage: sharp.Sharp
  mainBuffer: Buffer
  thumbnailBuffer: Buffer
  metadata: sharp.Metadata
  blurhash?: string
}> {
  const mainImage = sharp(fileSource).withMetadata().resize(options.main.width, options.main.height, { withoutEnlargement: true, fit: 'inside' })
  const thumbnailImage = sharp(fileSource).withMetadata().resize(options.thumbnail.width, options.thumbnail.height, { withoutEnlargement: true, fit: 'inside' })

  const [mainBuffer, thumb, metadata] = await Promise.all([
    mainImage.toBuffer(),
    thumbnailImage.toBuffer({ resolveWithObject: true }),
    mainImage.metadata(),
  ])

  const thumbnailBuffer = thumb.data

  const blurhash = await createBlurHash(thumbnailImage, thumb.info)

  return { mainImage, thumbnailImage, mainBuffer, thumbnailBuffer, metadata, blurhash }
}

const mimeTypes: { [extension: string]: string } = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
  '.bmp': 'image/bmp',
  '.tif': 'image/tiff',
  '.tiff': 'image/tiff',
  '.webp': 'image/webp',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xls': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.ppt': 'application/vnd.ms-powerpoint',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.csv': 'text/csv',
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.xml': 'application/xml',
  // Add more as needed
}

export function getExtensionFromMimeType(mimeType: string): string {
  const entries = Object.entries(mimeTypes)
  for (const [extension, type] of entries) {
    if (type === mimeType)
      return extension // Return extension including the dot
  }
  return '.jpg' // Default extension if not found
}

export async function getFileExtensionFromFetchResponse(response: Response) {
  if (!response.ok)
    throw new Error(`Failed to fetch: ${response.url}`)

  // Extract MIME type from the Content-Type header
  const contentType = response.headers.get('Content-Type')
  const mimeType = contentType ? contentType.split(';')[0] : ''

  return getExtensionFromMimeType(mimeType)
}

export function getMimeType(filePath?: string, defaultMime: string = 'application/octet-stream'): string {
  if (!filePath)
    return defaultMime
  const ext = path.extname(filePath).toLowerCase()
  return mimeTypes[ext] || defaultMime
}
