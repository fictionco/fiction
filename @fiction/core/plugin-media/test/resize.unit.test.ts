/**
 * @vitest-environment happy-dom
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ImageError, resizeImage } from '../browserResize'

describe('resizeImage', () => {
  const mockImage = {
    width: 1920,
    height: 1080,
    onload: undefined as any,
    onerror: undefined as any,
    src: '',
  }

  const mockCanvas = {
    width: 0,
    height: 0,
    getContext: vi.fn(() => ({
      drawImage: vi.fn(),
      imageSmoothingEnabled: true,
      imageSmoothingQuality: 'high',
    })),
    toBlob: vi.fn(cb => cb(new Blob(['test']))),
    toDataURL: vi.fn(() => 'data:image/webp'),
  }

  beforeEach(() => {
    vi.spyOn(document, 'createElement').mockReturnValue(mockCanvas as any)
    vi.spyOn(window, 'Image').mockImplementation(() => {
      const img = { ...mockImage }
      setTimeout(() => img.onload?.(), 0)
      return img as any
    })
  })

  describe('file type handling', () => {
    const nonResizableFiles = [
      ['SVG files', 'vector.svg', 'image/svg+xml'],
      ['PDF files', 'doc.pdf', 'application/pdf'],
      ['Video files', 'video.mp4', 'video/mp4'],
    ] as const

    it.each(nonResizableFiles)('passes through %s unchanged', async (_, fileName, mimeType) => {
      const file = new File(['test'], fileName, { type: mimeType })
      const result = await resizeImage(file)
      expect(result).toBe(file)
    })

    const resizableFiles = [
      ['JPEG', 'photo.jpg', 'image/jpeg'],
      ['PNG', 'image.png', 'image/png'],
      ['WebP', 'photo.webp', 'image/webp'],
      ['GIF', 'anim.gif', 'image/gif'],
    ] as const

    it.each(resizableFiles)('processes %s when needed', async (_, fileName, mimeType) => {
      const file = new File(['test'], fileName, { type: mimeType })
      mockImage.width = 3000
      mockImage.height = 2000

      const result = await resizeImage(file)
      expect(result).not.toBe(file)
    })
  })

  it('maintains aspect ratio', async () => {
    const file = new File(['test'], 'wide.jpg', { type: 'image/jpeg' })
    mockImage.width = 3000
    mockImage.height = 1000

    await resizeImage(file)
    expect(mockCanvas.width / mockCanvas.height).toBeCloseTo(3)
  })

  it('respects max dimensions', async () => {
    const file = new File(['test'], 'large.jpg', { type: 'image/jpeg' })
    mockImage.width = 4000
    mockImage.height = 3000

    await resizeImage(file, { maxWidth: 2000, maxHeight: 1500 })
    expect(mockCanvas.width).toBeLessThanOrEqual(2000)
    expect(mockCanvas.height).toBeLessThanOrEqual(1500)
  })

  it('reports progress', async () => {
    const onProgress = vi.fn()
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    await resizeImage(file, { onProgress })
    expect(onProgress).toHaveBeenCalledWith(1)
  })

  it('handles load errors', async () => {
    vi.spyOn(window, 'Image').mockImplementation(() => {
      const img = { ...mockImage }
      setTimeout(() => img.onerror?.(new Error('Load failed')), 0)
      return img as any
    })

    const file = new File(['test'], 'error.jpg', { type: 'image/jpeg' })
    await expect(resizeImage(file)).rejects.toThrow(ImageError)
  })
})
