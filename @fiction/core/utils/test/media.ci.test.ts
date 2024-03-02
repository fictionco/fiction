import * as crypto from 'node:crypto'
import path from 'node:path'
import os from 'node:os'
import { Buffer } from 'node:buffer'
import fs from 'fs-extra'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import sharp from 'sharp'
import { createBlurHash, createImageVariants, getExtensionFromMimeType, getFileExtensionFromFetchResponse, getMimeType, hashFile } from '../media'
import { testImgPath } from '../../test-utils'

/**
 * BLURHASH
 */
describe('createBlurHash', () => {
  it('should create a valid blurhash for an image', async () => {
    const img = sharp(testImgPath)
    const imgBuffer = await img.toBuffer({ resolveWithObject: true })

    const blurhash = await createBlurHash(img, imgBuffer.info)
    expect(blurhash).toBeDefined()
    expect(blurhash).toMatchInlineSnapshot(`"U98qNkog00WBoffQayfQ00Rj~qofRjayoffR"`)
  })
})

/**
 * IMAGE VARIANTS
 */
describe('createImageVariants', () => {
  it('should create main and thumbnail image variants', async () => {
    const fileSource = fs.readFileSync(testImgPath)
    const options = {
      main: { width: 100, height: 100 },
      thumbnail: { width: 50, height: 50 },
    }

    const { mainBuffer, thumbnailBuffer, metadata, blurhash } = await createImageVariants(fileSource, options)

    expect(mainBuffer).toBeInstanceOf(Buffer)
    expect(thumbnailBuffer).toBeInstanceOf(Buffer)
    expect(metadata).toBeDefined()
    expect(blurhash).toBeDefined()
    // You can add more assertions to check the dimensions of the images, etc.
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

  it('should return default MIME type when file path is undefined', () => {
    const mimeType = getMimeType()
    expect(mimeType).toBe('application/octet-stream')
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
