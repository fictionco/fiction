import { Buffer } from 'node:buffer'
import * as crypto from 'node:crypto'
import os from 'node:os'
import path from 'node:path'
import fs from 'fs-extra'
import sharp from 'sharp'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import type { MediaObject } from '@fiction/platform'
import type { IconId } from '@fiction/ui/lib/systemIcons'
import { testImgPath, testSvgPath } from '../../test-utils'
import { createBlurHash, createImageVariants, determineMediaFormat, getExtensionFromMimeType, getFileExtensionFromFetchResponse, getMimeType, hashFile } from '../media'
import { safeDirname } from '../utils'
import type { ImageSizeOptions } from '../media'

describe('determineMediaFormat', () => {
  it('should return the format if it is already set', () => {
    const media: MediaObject = { format: 'video', url: 'https://example.com/video.mp4' }
    expect(determineMediaFormat(media)).toBe('video')
  })

  it('should return "iconId" for media with iconId', () => {
    const media: MediaObject = { iconId: 'airplane' }
    expect(determineMediaFormat(media)).toBe('iconId')
  })

  it('should return "iconClass" for media with class', () => {
    const media: MediaObject = { class: 'some-icon-class' }
    expect(determineMediaFormat(media)).toBe('iconClass')
  })

  it('should return "html" for media with html content', () => {
    const media: MediaObject = { html: '<div>Some HTML</div>' }
    expect(determineMediaFormat(media)).toBe('html')
  })

  it('should return "typography" for media with typography', () => {
    const media: MediaObject = { typography: { text: 'Some text', font: 'Arial' } }
    expect(determineMediaFormat(media)).toBe('typography')
  })

  it('should return "image" for valid image URLs', () => {
    const media: MediaObject = { url: 'https://example.com/image.jpg' }
    expect(determineMediaFormat(media)).toBe('image')
  })

  it('should return "video" for valid video URLs', () => {
    const media: MediaObject = { url: 'https://example.com/video.mp4' }
    expect(determineMediaFormat(media)).toBe('video')
  })

  it('should return "image" for URLs from known image hosting services', () => {
    const media: MediaObject = { url: 'https://imgur.com/someimage' }
    expect(determineMediaFormat(media)).toBe('image')
  })

  it('should return "image" for URLs with unknown extensions', () => {
    const media: MediaObject = { url: 'https://example.com/file.xyz' }
    expect(determineMediaFormat(media)).toBe('image')
  })

  it('should return "undefined" for invalid URLs', () => {
    const media: MediaObject = { url: 'not-a-valid-url' }
    expect(determineMediaFormat(media)).toBeFalsy()
  })

  it('should return "undefined" for empty media objects', () => {
    const media: MediaObject = {}
    expect(determineMediaFormat(media)).toBeFalsy()
  })

  it('should return "undefined" for media objects with only unrelated properties', () => {
    // @ts-expect-error test
    const media: MediaObject = { someProperty: 'someValue' }
    expect(determineMediaFormat(media)).toBeFalsy()
  })
})

/**
 * BLURHASH
 */
describe('createBlurHash', () => {
  it('should create a valid blurhash for an image', async () => {
    const img = sharp(testImgPath)
    const imgBuffer = await img.toBuffer({ resolveWithObject: true })

    const blurhash = await createBlurHash(img, imgBuffer.info)
    expect(blurhash).toBeDefined()
    expect(blurhash).toMatchInlineSnapshot(`"UHFY$2-;M{?b~qt7WBt7_3-;%MM{%Mj[j[M{"`)
  })
})

/**
 * IMAGE VARIANTS
 */
describe('createImageVariants', () => {
  it('should create main and thumbnail image variants', async () => {
    const fileMime = getMimeType(testImgPath)
    const fileSource = fs.readFileSync(testImgPath)
    const sizeOptions = {
      main: { width: 100, height: 100 },
      thumbnail: { width: 50, height: 50 },
    }

    const { mainBuffer, thumbnailBuffer, metadata, blurhash } = await createImageVariants({ fileSource, sizeOptions, fileMime })

    expect(mainBuffer).toBeInstanceOf(Buffer)
    expect(thumbnailBuffer).toBeInstanceOf(Buffer)
    expect(metadata).toBeDefined()
    expect(blurhash).toBeDefined()
    // Additional assertions
    const mainImage = sharp(mainBuffer)
    const mainMetadata = await mainImage.metadata()
    expect(mainMetadata.width).toBe(sizeOptions.main.width)
    expect(mainMetadata.height).toBe(sizeOptions.main.height)

    const thumbnailImage = sharp(thumbnailBuffer)
    const thumbnailMetadata = await thumbnailImage.metadata()
    expect(thumbnailMetadata.width).toBe(sizeOptions.thumbnail.width)
    expect(thumbnailMetadata.height).toBe(sizeOptions.thumbnail.height)

    if (thumbnailBuffer)
      fs.writeFileSync(`${safeDirname(import.meta.url)}/img/thumbnail-test.png`, thumbnailBuffer)
  })

  it('should process SVG images correctly', async () => {
    const fileMime = getMimeType(testSvgPath)
    const fileSource = fs.readFileSync(testSvgPath)
    const sizeOptions = {
      main: { width: 100, height: 100 },
      thumbnail: { width: 50, height: 50 },
    }

    const { mainBuffer, thumbnailBuffer, metadata, blurhash, rasterBuffer } = await createImageVariants({ fileSource, sizeOptions, fileMime })

    expect(mainBuffer).toBeInstanceOf(Buffer)
    expect(thumbnailBuffer).toBeInstanceOf(Buffer)
    expect(blurhash).toBeDefined()

    expect(metadata).toMatchInlineSnapshot(`
      {
        "channels": 4,
        "density": 300,
        "depth": "uchar",
        "format": "svg",
        "hasAlpha": true,
        "hasProfile": false,
        "height": 604,
        "isProgressive": false,
        "size": 742,
        "space": "srgb",
        "width": 588,
      }
    `)

    const thumbnailImage = sharp(thumbnailBuffer)
    const thumbnailMetadata = await thumbnailImage.metadata()
    expect(thumbnailMetadata.width).toBeGreaterThanOrEqual(sizeOptions.thumbnail.width - 5)
    expect(thumbnailMetadata.height).toBe(sizeOptions.thumbnail.height)

    if (rasterBuffer)
      fs.writeFileSync(`${safeDirname(import.meta.url)}/img/svg-to-png-test.png`, rasterBuffer)
  })

  it('should crop the image correctly', async () => {
    const fileMime = getMimeType(testImgPath)
    const fileSource = fs.readFileSync(testImgPath)
    const sizeOptions: ImageSizeOptions = {
      main: { width: 200, height: 200 },
      thumbnail: { width: 50, height: 50 },
      crop: { width: 300, height: 500, left: 10, top: 10 },
    }

    const { mainBuffer, thumbnailBuffer, metadata, blurhash } = await createImageVariants({ fileSource, sizeOptions, fileMime })

    expect(mainBuffer).toBeInstanceOf(Buffer)
    expect(thumbnailBuffer).toBeInstanceOf(Buffer)
    expect(metadata).toBeDefined()
    expect(blurhash).toBeDefined()

    const mainImage = sharp(mainBuffer)
    const mainMetadata = await mainImage.metadata()
    expect(mainMetadata.width).toBe(120)
    expect(mainMetadata.height).toBe(sizeOptions.main?.height)

    if (thumbnailBuffer)
      fs.writeFileSync(`${safeDirname(import.meta.url)}/img/cropped-thumbnail-test.png`, thumbnailBuffer)
  })
})

/**
 * MIME TYPE
 */
describe('getMimeType', () => {
  it.each([
    ['test.jpg', 'image/jpeg'],
    ['test.png', 'image/png'],
    ['test.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    ['unknownfile.xyz', 'application/octet-stream'], // Default case
  ])('should return correct MIME type for %s', (filePath, expectedMimeType) => {
    const mimeType = getMimeType(filePath)
    expect(mimeType).toBe(expectedMimeType)
  })
})

describe('getExtensionFromMimeType', () => {
  it.each([
    ['image/jpeg', '.jpg'],
    ['image/png', '.png'],
    ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', '.docx'],
    ['application/nonexistent', '.jpg'], // Default case
  ])('should return correct file extension for MIME type %s', (mimeType, expectedExtension) => {
    const extension = getExtensionFromMimeType(mimeType)
    expect(extension).toBe(expectedExtension)
  })
})

describe('getFileExtensionFromFetchResponse', () => {
  it('should throw an error for a failed fetch response', async () => {
    const mockResponse = {
      ok: false,
      url: 'https://example.com/broken-link',
    } as Response
    await expect(getFileExtensionFromFetchResponse(mockResponse))
      .rejects
      .toThrow('Failed to fetch: https://example.com/broken-link')
  })

  it.each([
    [{ 'Content-Type': 'image/jpeg' }, '.jpg'],
    [{ 'Content-Type': 'image/png' }, '.png'],
    [{ 'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }, '.docx'],
    [{}, '.jpg'], // No Content-Type header leads to default extension
  ])('should return correct file extension for response with Content-Type %s', async (headers, expectedExtension) => {
    const mockResponse = {
      ok: true,
      url: 'https://example.com/image',
      headers: {
        get(name) {
          return (headers as Record<string, string>)[name]
        },
      },
    } as Response
    const extension = await getFileExtensionFromFetchResponse(mockResponse)
    expect(extension).toBe(expectedExtension)
  })
})

/**
 * HASHFILE
 */
const testFileName = 'vitest_hash_test_file.txt'
const testFileContent = 'Hello, world!'
let testFilePath: string

// Helper function to calculate the SHA-256 hash
function calculateSha256Hash(content: string): string {
  return crypto.createHash('sha256').update(content).digest('hex')
}

describe('media utils - hashFile function', () => {
  beforeAll(async () => {
    // Create a temporary directory
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'vitest-'))
    testFilePath = path.join(tempDir, testFileName)

    // Write test file
    await fs.writeFile(testFilePath, testFileContent)
  })

  afterAll(async () => {
    // Clean up: delete the test file
    await fs.unlink(testFilePath)
  })

  it('hashes files correctly', async () => {
    const expectedHash = calculateSha256Hash(testFileContent)
    const actualHash = await hashFile({ filePath: testFilePath })

    expect(actualHash).toBe(expectedHash)
  })

  it('throws an error for non-existent files', async () => {
    const nonExistentFilePath = path.join(path.dirname(testFilePath), 'non-existent-file.txt')
    await expect(hashFile({ filePath: nonExistentFilePath })).rejects.toThrow()
  })

  it('hashes files correctly as a stream', async () => {
    const expectedHash = calculateSha256Hash(testFileContent)
    const actualHash = await hashFile({ filePath: testFilePath })

    expect(actualHash).toBe(expectedHash)
  })

  it('hashes files correctly from buffer', async () => {
    const fileBuffer = Buffer.from(testFileContent)
    const expectedHash = calculateSha256Hash(testFileContent)
    const actualHash = await hashFile({ buffer: fileBuffer })

    expect(actualHash).toBe(expectedHash)
  })

  it('produces the same hash for both buffer and stream methods', async () => {
    const fileBuffer = Buffer.from(testFileContent)
    const hashFromBuffer = await hashFile({ buffer: fileBuffer })
    const hashFromStream = await hashFile({ filePath: testFilePath })

    expect(hashFromBuffer).toBe(hashFromStream)
  })
})
