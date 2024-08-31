import { Buffer } from 'node:buffer'
import { afterAll, describe, expect, it, vi } from 'vitest'
import fs from 'fs-extra'
import type { EndpointMeta } from '@fiction/core/utils'
import sharp from 'sharp'
import type { TableMediaConfig } from '@fiction/core'
import { createTestUtils } from '../../test-utils/init'
import { FictionMedia } from '..'
import { FictionAws } from '../../plugin-aws'
import { testEnvFile, testImgPath } from '../../test-utils'
import type { TestUtils } from '../../test-utils/init'
import { getEnvVars, path } from '../../utils'

let testUtils: TestUtils & { fictionMedia?: FictionMedia }
let meta: EndpointMeta

describe('createAndSaveMedia', async () => {
  if (!fs.existsSync(testEnvFile))
    console.warn(`missing test env file ${testEnvFile}`)

  testUtils = createTestUtils({ envFiles: [testEnvFile] }) as TestUtils & { fictionMedia?: FictionMedia }

  const v = getEnvVars(testUtils.fictionEnv, ['AWS_ACCESS_KEY', 'AWS_ACCESS_KEY_SECRET', 'UNSPLASH_ACCESS_KEY', 'AWS_BUCKET_MEDIA', 'AWS_REGION'] as const)

  const { awsAccessKey, awsAccessKeySecret, unsplashAccessKey, awsBucketMedia, awsRegion } = v

  const fictionEnv = testUtils.fictionEnv
  const fictionAws = new FictionAws({ fictionEnv, awsAccessKey, awsAccessKeySecret, awsRegion })

  const mediaService = { ...testUtils, fictionAws, awsBucketMedia, unsplashAccessKey }
  testUtils.fictionMedia = new FictionMedia(mediaService)
  const fictionMediaCdn = new FictionMedia({ ...mediaService, cdnUrl: 'https://media.fiction.com' })
  testUtils.initialized = await testUtils.init()
  const orgId = testUtils.initialized?.orgId || ''
  const userId = testUtils.initialized?.user?.userId || ''

  meta = {} as EndpointMeta // Mock meta as needed

  afterAll(async () => {
    await testUtils.close()
  })

  it('should create and save media WITHOUT cropping', async () => {
    const fileMime = 'image/jpeg'
    const mediaConfig: TableMediaConfig = { orgId, userId, filePath: testImgPath, sourceImageUrl: '', mime: fileMime }
    const fields = mediaConfig
    const result = await testUtils.fictionMedia?.queries.ManageMedia.serve({ _action: 'checkAndCreate', noCache: true, fields, userId, orgId }, meta)

    expect(result?.status).toBe('success')
    const media1 = result?.data?.[0]
    expect(media1?.url).toContain('fiction-media')
    expect(media1?.mime).toBe(fileMime)

    const result2 = await fictionMediaCdn.queries.ManageMedia.serve({ _action: 'checkAndCreate', noCache: true, fields, userId, orgId }, meta)
    const media2 = result2?.data?.[0]
    expect(result2?.status).toBe('success')
    expect(media2?.url).toContain('https://media.fiction.com')
    expect(media2?.originUrl, 'originUrl is aws url').toContain('fiction-media')
  })

  it('should create and save media WITH cropping', async () => {
    const fileMime = 'image/jpeg'

    const mediaConfig: TableMediaConfig = { orgId, userId, filePath: testImgPath, sourceImageUrl: '', mime: fileMime }

    const crop = { width: 100, height: 100, left: 10, top: 10 }

    const checkArgs = { _action: 'checkAndCreate', fields: mediaConfig, userId, orgId, crop } as const

    const result = await testUtils.fictionMedia?.queries.ManageMedia.serve({ ...checkArgs, noCache: true }, meta)

    expect(result?.status).toBe('success')

    const media = result?.data?.[0]

    expect(media?.url).toContain('fiction-media')
    expect(media?.mime).toBe(fileMime)

    // Download the image from the URL
    const imageUrl = media?.url?.split('?')[0] // Remove query params

    if (!imageUrl)
      throw new Error('No image URL found')

    const response = await fetch(imageUrl)
    const buffer = await response.arrayBuffer()

    // Additional assertions for crop size
    const mainImage = sharp(buffer)
    const mainMetadata = await mainImage.metadata()
    expect(mainMetadata.width).toBe(crop.width)
    expect(mainMetadata.height).toBe(crop.height)
  })

  it('should handle various image types', async () => {
    const fileMime = 'image/jpeg' // Can change this to other MIME types for testing

    const mediaConfig: TableMediaConfig = {
      orgId,
      userId,
      filePath: testImgPath,
      sourceImageUrl: '',
      mime: fileMime,
    }

    const result = await testUtils.fictionMedia?.queries.ManageMedia.run({
      _action: 'checkAndCreate',
      fields: mediaConfig,
      userId,
      orgId,
      noCache: true,
    }, meta)

    expect(result?.status).toBe('success')
    const media = result?.data?.[0]
    expect(media?.url).toContain('fiction-media')
    expect(media?.mime).toBe(fileMime)

    // Additional assertions for different image types can be added here
  })

  it('should throw an error if no file is provided', async () => {
    const mediaConfig: TableMediaConfig = { orgId, userId, filePath: '', sourceImageUrl: '', mime: '' }

    const result = await testUtils.fictionMedia?.queries.ManageMedia.serve({
      _action: 'checkAndCreate',
      fields: mediaConfig,
      userId,
      orgId,
      noCache: true,
    }, { ...meta, expectError: true })

    expect(result?.status).toBe('error')
    expect(result?.message).toMatchInlineSnapshot(`"[EXPECTED] File path is required for checkAndCreate action."`)
  })

  it('should handle very long filenames', async () => {
    const longFileName = `${'a'.repeat(200)}.jpg` // 200 characters plus extension
    const fileMime = 'image/jpeg'
    const testDir = path.dirname(testImgPath)
    const longFileNamePath = path.join(testDir, longFileName)

    // Create a copy of the test image with a long filename
    fs.copyFileSync(testImgPath, longFileNamePath)

    const mediaConfig: TableMediaConfig = {
      orgId,
      userId,
      filePath: longFileNamePath,
      sourceImageUrl: '',
      mime: fileMime,
    }

    try {
      const result = await testUtils.fictionMedia?.queries.ManageMedia.serve({
        _action: 'checkAndCreate',
        fields: mediaConfig,
        userId,
        orgId,
        noCache: true,
      }, meta)

      expect(result?.status).toBe('success')
      const media = result?.data?.[0]
      expect(media?.url).toContain('fiction-media')

      // Check if the filename in the URL has been truncated or handled
      const urlFileName = path.basename(new URL(media?.url || '').pathname)
      expect(urlFileName.length).toBeLessThan(longFileName.length)
      expect(urlFileName.length).toBeLessThanOrEqual(255)

      // Check if the stored filePath has been handled properly
      expect(media?.filePath?.length).toBeLessThanOrEqual(255)
    }
    finally {
      // Clean up: remove the test file
      fs.unlinkSync(longFileNamePath)
    }
  })

  it('should reject files exceeding size limit', async () => {
    const largePath = path.join(path.dirname(testImgPath), 'large_test_file.jpg')
    const largeBuffer = Buffer.alloc(11 * 1024 * 1024) // 11MB file
    fs.writeFileSync(largePath, largeBuffer)

    const mediaConfig: TableMediaConfig = {
      orgId,
      userId,
      filePath: largePath,
      sourceImageUrl: '',
      mime: 'image/jpeg',
    }

    const result = await testUtils.fictionMedia?.queries.ManageMedia.serve({
      _action: 'checkAndCreate',
      fields: mediaConfig,
      userId,
      orgId,
      noCache: true,
    }, { ...meta, expectError: true })

    expect(result?.status).toBe('error')
    expect(result?.message).toContain('File size exceeds limit')

    fs.unlinkSync(largePath)
  })

  it('should reject unsupported file types', async () => {
    const textFilePath = path.join(path.dirname(testImgPath), 'test.txt')
    fs.writeFileSync(textFilePath, 'This is a test file')

    const mediaConfig: TableMediaConfig = {
      orgId,
      userId,
      filePath: textFilePath,
      sourceImageUrl: '',
      mime: 'text/plain',
    }

    const result = await testUtils.fictionMedia?.queries.ManageMedia.serve({
      _action: 'checkAndCreate',
      fields: mediaConfig,
      userId,
      orgId,
      noCache: true,
    }, { ...meta, expectError: true })

    expect(result?.status).toBe('error')
    expect(result?.message).toContain('Unsupported file type')

    fs.unlinkSync(textFilePath)
  })

  it('should handle duplicate uploads correctly', async () => {
    const fileMime = 'image/jpeg'
    const mediaConfig: TableMediaConfig = {
      orgId,
      userId,
      filePath: testImgPath,
      sourceImageUrl: '',
      mime: fileMime,
    }

    const firstUpload = await testUtils.fictionMedia?.queries.ManageMedia.serve({
      _action: 'checkAndCreate',
      fields: mediaConfig,
      userId,
      orgId,
    }, meta)

    const secondUpload = await testUtils.fictionMedia?.queries.ManageMedia.serve({
      _action: 'checkAndCreate',
      fields: mediaConfig,
      userId,
      orgId,
    }, meta)

    expect(firstUpload?.status).toBe('success')
    expect(secondUpload?.status).toBe('success')
    const firstMedia = firstUpload?.data?.[0]
    const secondMedia = secondUpload?.data?.[0]
    expect(secondMedia?.isCached).toBe(true)
    expect(firstMedia?.url).toBe(secondMedia?.url)
  })

  it('should handle network errors during upload', async () => {
    const fileMime = 'image/jpeg'
    const mediaConfig: TableMediaConfig = {
      orgId,
      userId,
      filePath: testImgPath,
      sourceImageUrl: '',
      mime: fileMime,
    }

    // Mock S3 upload to simulate network error
    const mockUploadS3 = vi.spyOn(fictionAws, 'uploadS3')
    mockUploadS3.mockRejectedValueOnce(new Error('Network error'))

    const result = await testUtils.fictionMedia?.queries.ManageMedia.serve({
      _action: 'checkAndCreate',
      fields: mediaConfig,
      userId,
      orgId,
      noCache: true,
    }, { ...meta, expectError: true })

    expect(result?.status).toBe('error')
    expect(result?.message).toContain(`Failed to upload media`)

    mockUploadS3.mockRestore()
  })

  it('should list media with pagination and filtering', async () => {
    // First, create some test media
    const fileMime = 'image/jpeg'
    const mediaConfig: TableMediaConfig = { orgId, userId, filePath: testImgPath, sourceImageUrl: '', mime: fileMime }
    await testUtils.fictionMedia?.queries.ManageMedia.serve({ _action: 'checkAndCreate', noCache: true, fields: mediaConfig, userId, orgId }, meta)

    // Now test listing
    const listResult = await testUtils.fictionMedia?.queries.ManageMedia.serve({
      _action: 'list',
      orgId,
      limit: 10,
      offset: 0,
      filters: [{ field: 'mime', operator: '=', value: fileMime }],
    }, meta)

    expect(listResult?.status).toBe('success')
    expect(Array.isArray(listResult?.data)).toBe(true)
    expect(listResult?.data?.length).toBeGreaterThan(0)
    expect(listResult?.indexMeta).toBeDefined()
    expect(listResult?.indexMeta?.count).toBeGreaterThan(0)
  })

  it('should count media with filters', async () => {
    const countResult = await testUtils.fictionMedia?.queries.ManageMedia.serve({
      _action: 'count',
      orgId,
      filters: [{ field: 'mime', operator: '=', value: 'image/jpeg' }],
    }, meta)

    expect(countResult?.status).toBe('success')
    expect(countResult?.indexMeta).toBeDefined()
    expect(typeof countResult?.indexMeta?.count).toBe('number')
  })
})
