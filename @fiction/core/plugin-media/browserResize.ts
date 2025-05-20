// utils/imageResize.ts

import { formatBytes } from '../utils/number'

export type ResizeOptions = {
  maxWidth?: number
  maxHeight?: number
  maxFileSize?: number
  quality?: number
  preferWebP?: boolean
  onProgress?: (progress: number) => void
}

export class ImageError extends Error {
  constructor(message: string, public code: 'LOAD' | 'SIZE' | 'FORMAT' | 'CANVAS') {
    super(message)
    this.name = 'ImageError'
  }
}

const RESIZABLE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
])

const DEFAULT_CONFIG = {
  maxWidth: 2200, // Optimal for large displays
  maxHeight: 1400, // Maintain aspect ratio for common screens
  maxFileSize: 2.5 * 1024 * 1024, // 2.5MB - good balance for web
  quality: 0.92, // Start with high quality
  preferWebP: true,
} as const

// Test browser WebP support
async function supportsWebP(): Promise<boolean> {
  const canvas = document.createElement('canvas')
  try {
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
  }
  catch {
    return false
  }
}

async function loadImage(file: File | Blob): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file)
  try {
    const img = new Image()
    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = () => reject(new ImageError('Failed to load image', 'LOAD'))
      img.src = url
    })
    return img
  }
  finally {
    URL.revokeObjectURL(url)
  }
}

function calculateDimensions(img: HTMLImageElement, maxWidth: number, maxHeight: number) {
  const scale = Math.min(maxWidth / img.width, maxHeight / img.height, 1)
  return {
    width: Math.floor(img.width * scale),
    height: Math.floor(img.height * scale),
  }
}

async function optimizeImage(canvas: HTMLCanvasElement, args: {
  maxFileSize: number
  preferWebP: boolean
  originalType: string
  quality?: number
}): Promise<{ blob: Blob, type: string }> {
  const { maxFileSize, preferWebP, originalType, quality = 0.92 } = args

  // Determine format priority
  const formats = preferWebP && await supportsWebP()
    ? ['image/webp', originalType, 'image/jpeg']
    : [originalType, 'image/jpeg']

  for (const type of formats) {
    let currentQuality = quality

    while (currentQuality >= 0.5) { // Don't degrade below 50%
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, type, currentQuality)
      })

      if (!blob)
        continue

      if (blob.size <= maxFileSize) {
        return { blob, type }
      }

      // Gradual quality reduction
      currentQuality -= 0.05
    }
  }

  throw new ImageError(`Could not optimize below ${formatBytes(maxFileSize)}`, 'SIZE')
}

export async function resizeImage(file: File | Blob, options: ResizeOptions = {}): Promise<File> {
  const {
    maxWidth = DEFAULT_CONFIG.maxWidth,
    maxHeight = DEFAULT_CONFIG.maxHeight,
    maxFileSize = DEFAULT_CONFIG.maxFileSize,
    quality = DEFAULT_CONFIG.quality,
    preferWebP = DEFAULT_CONFIG.preferWebP,
    onProgress,
  } = options

  const fileName = file instanceof File ? file.name : 'image'

  // Pass through non-resizable files
  if (!RESIZABLE_TYPES.has(file.type)) {
    return file instanceof File ? file : new File([file], fileName, { type: file.type })
  }

  try {
    onProgress?.(0.2)
    const img = await loadImage(file)

    // Skip resize if image is already optimal
    if (img.width <= maxWidth && img.height <= maxHeight && file.size <= maxFileSize) {
      return file instanceof File ? file : new File([file], fileName, { type: file.type })
    }

    onProgress?.(0.4)
    const { width, height } = calculateDimensions(img, maxWidth, maxHeight)

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new ImageError('Canvas context unavailable', 'CANVAS')
    }

    canvas.width = width
    canvas.height = height

    // High quality image scaling
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(img, 0, 0, width, height)

    onProgress?.(0.6)

    // Optimize with format selection
    const { blob, type } = await optimizeImage(canvas, {
      maxFileSize,
      preferWebP,
      originalType: file.type,
      quality,
    })

    onProgress?.(0.8)

    // Create new filename
    const extension = type.split('/')[1]
    const newName = fileName.replace(/\.[^.]+$/, `.${extension}`)

    onProgress?.(1)
    return new File([blob], newName, { type })
  }
  catch (error) {
    if (error instanceof ImageError)
      throw error
    throw new ImageError('Unexpected resize error', 'FORMAT')
  }
}
