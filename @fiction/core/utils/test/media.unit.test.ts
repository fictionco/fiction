import * as crypto from 'node:crypto'
import path from 'node:path'
import os from 'node:os'
import { Buffer } from 'node:buffer'
import fs from 'fs-extra'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import sharp from 'sharp'
import type { ImageSizeOptions } from '../media'
import { createBlurHash, createImageVariants, getExtensionFromMimeType, getFileExtensionFromFetchResponse, getMimeType, hashFile } from '../media'
import { testImgPath, testSvgPath } from '../../test-utils'
import { safeDirname } from '../utils'

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
