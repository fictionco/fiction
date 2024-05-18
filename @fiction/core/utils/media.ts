import type { Buffer } from 'node:buffer'
import path from 'node:path'
import type sharp from 'sharp'
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

export type CropSettings = { width: number, height: number, left: number, top: number }

export type ImageSizeOptions = {
  main: { width: number, height: number }
  thumbnail: { width: number, height: number }
  crop?: CropSettings
}

export type ImageVariantStreams = {
  mainImage?: sharp.Sharp
  thumbnailImage?: sharp.Sharp
  mainBuffer: Buffer
  thumbnailBuffer?: Buffer
  rasterBuffer?: Buffer
  metadata?: sharp.Metadata
  blurhash?: string
}

export async function createImageVariants(args: { fileSource: Buffer, sizeOptions: ImageSizeOptions, fileMime: string }): Promise<ImageVariantStreams> {
  const { fileSource, sizeOptions, fileMime } = args

  const isRaster = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(fileMime)
  const isSvg = fileMime === 'image/svg+xml'
  const isImage = isRaster || isSvg

  if (!isImage)
    return { mainBuffer: fileSource }

  const { default: sharp } = await import('sharp')

  const out: ImageVariantStreams = { mainBuffer: fileSource }
  const width = sizeOptions.main.width
  const height = sizeOptions.main.height
  const resizeOptions = { withoutEnlargement: true, fit: 'inside', kernel: sharp.kernel.nearest } as const
  try {
    if (isSvg) {
      out.mainImage = sharp(fileSource, { density: 300 }).resize(width, height, { kernel: sharp.kernel.nearest, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })

      out.rasterBuffer = await out.mainImage.toBuffer()
    }
    else {
      let mainImage = sharp(fileSource).withMetadata()
      if (sizeOptions.crop)
        mainImage = mainImage.extract(sizeOptions.crop)

      out.mainImage = mainImage.resize(width, height, resizeOptions)
      out.mainBuffer = await mainImage.toBuffer()
    }

    const baseImage = out.mainImage
    if (baseImage) {
      out.thumbnailImage = baseImage.clone().resize(sizeOptions.thumbnail.width, sizeOptions.thumbnail.height, resizeOptions).png()
      const thumb = await out.thumbnailImage.toBuffer({ resolveWithObject: true })
      out.thumbnailBuffer = thumb.data

      out.blurhash = thumb.info ? await createBlurHash(out.thumbnailImage, thumb.info) : ''
    }

    out.metadata = await out.mainImage.metadata()
  }
  catch (error) {
    console.error('Error processing image:', error)
  }

  return out
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
