import { Buffer } from 'node:buffer'
import fs from 'fs-extra'
import sharp from 'sharp'
import { afterAll, afterEach, describe, expect, it, vi } from 'vitest'
import type { TableMediaConfig } from '@fiction/core'
import type { EndpointMeta } from '@fiction/core/utils'
import { FictionMedia } from '..'
import { FictionAws } from '../../plugin-aws'
import { testEnvFile, testImgPath, testVideoPath } from '../../test-utils'
import { createTestUtils } from '../../test-utils/init'
import { getEnvVars, path } from '../../utils'
import type { TestUtils } from '../../test-utils/init'

describe('createAndSaveMedia', async () => {
  if (!fs.existsSync(testEnvFile))
    console.warn(`missing test env file ${testEnvFile}`)

  const testUtils = createTestUtils({ envFiles: [testEnvFile] }) as TestUtils & { fictionMedia?: FictionMedia }

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

  const meta = {} as EndpointMeta // Mock meta as needed

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

describe('video upload functionality', async () => {
  if (!fs.existsSync(testEnvFile))
    console.warn(`missing test env file ${testEnvFile}`)

  const testUtils = createTestUtils({ envFiles: [testEnvFile] }) as TestUtils & { fictionMedia?: FictionMedia }

  const v = getEnvVars(testUtils.fictionEnv, ['AWS_ACCESS_KEY', 'AWS_ACCESS_KEY_SECRET', 'UNSPLASH_ACCESS_KEY', 'AWS_BUCKET_MEDIA', 'AWS_REGION'] as const)

  const { awsAccessKey, awsAccessKeySecret, unsplashAccessKey, awsBucketMedia, awsRegion } = v

  const fictionEnv = testUtils.fictionEnv
  const fictionAws = new FictionAws({ fictionEnv, awsAccessKey, awsAccessKeySecret, awsRegion })

  const mediaService = { ...testUtils, fictionAws, awsBucketMedia, unsplashAccessKey }
  testUtils.fictionMedia = new FictionMedia(mediaService)
  testUtils.initialized = await testUtils.init()
  const orgId = testUtils.initialized?.orgId || ''
  const userId = testUtils.initialized?.user?.userId || ''
  let uploadedMediaIds: string[] = []

  const meta = {} as EndpointMeta // Mock meta as needed

  afterEach(async () => {
    // Clean up uploaded media after each test
    for (const mediaId of uploadedMediaIds) {
      await testUtils.fictionMedia?.queries.ManageMedia.serve({
        _action: 'delete',
        orgId,
        where: [{ mediaId }],
      }, meta)
    }
    uploadedMediaIds = []
  })

  afterAll(async () => {
    // Perform any final cleanup if necessary
    await testUtils.close()
  })

  it('should upload and process an MP4 file correctly', async () => {
    const fileMime = 'video/mp4'
    const mediaConfig: TableMediaConfig = {
      orgId,
      userId,
      filePath: testVideoPath,
      sourceImageUrl: '',
      mime: fileMime,
    }

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
    expect(media?.mime).toBe(fileMime)
    expect(media?.width).toBeGreaterThan(0)
    expect(media?.height).toBeGreaterThan(0)
    expect(media?.duration).toBeGreaterThan(0)
  })

  it('should extract correct metadata from the MP4 file', async () => {
    const fileMime = 'video/mp4'
    const mediaConfig: TableMediaConfig = {
      orgId,
      userId,
      filePath: testVideoPath,
      sourceImageUrl: '',
      mime: fileMime,
    }

    const result = await testUtils.fictionMedia?.queries.ManageMedia.serve({
      _action: 'checkAndCreate',
      fields: mediaConfig,
      userId,
      orgId,
      noCache: true,
    }, meta)

    const media = result?.data?.[0]
    expect({ width: media?.width, height: media?.height, duration: media?.duration }).toMatchInlineSnapshot(`
      {
        "duration": 5.28,
        "height": 720,
        "width": 1280,
      }
    `)
    expect(media?.width).toBe(1280) // Adjust these values based on your test video
    expect(media?.height).toBe(720)
    expect(media?.duration).toBeCloseTo(5, 0) // Assuming the test video is about 10 seconds long
  })

  it('should handle large video files', async () => {
    const largeVideoPath = path.join(path.dirname(testVideoPath), 'large_test_video.mp4')
    const largeBuffer = Buffer.alloc(15 * 1024 * 1024) // 15MB file
    fs.writeFileSync(largeVideoPath, largeBuffer)

    const mediaConfig: TableMediaConfig = {
      orgId,
      userId,
      filePath: largeVideoPath,
      sourceImageUrl: '',
      mime: 'video/mp4',
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

    fs.unlinkSync(largeVideoPath)
  })

  it('should reject unsupported video formats', async () => {
    const unsupportedVideoPath = path.join(path.dirname(testVideoPath), 'test.avi')
    fs.writeFileSync(unsupportedVideoPath, Buffer.from('Fake AVI content'))

    const mediaConfig: TableMediaConfig = {
      orgId,
      userId,
      filePath: unsupportedVideoPath,
      sourceImageUrl: '',
      mime: 'video/x-msvideo',
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

    fs.unlinkSync(unsupportedVideoPath)
  })

  it('should handle video files with no metadata gracefully', async () => {
    const noMetadataVideoPath = path.join(path.dirname(testVideoPath), 'no_metadata.mp4')
    fs.writeFileSync(noMetadataVideoPath, Buffer.from('Fake MP4 content without metadata'))

    const mediaConfig: TableMediaConfig = {
      orgId,
      userId,
      filePath: noMetadataVideoPath,
      sourceImageUrl: '',
      mime: 'video/mp4',
    }

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
    expect(media?.mime).toBe('video/mp4')
    expect(media?.width).toBeFalsy()
    expect(media?.height).toBeFalsy()
    expect(media?.duration).toBeFalsy()

    fs.unlinkSync(noMetadataVideoPath)
  })

  it('should not generate blurhash for video files', async () => {
    const fileMime = 'video/mp4'
    const mediaConfig: TableMediaConfig = {
      orgId,
      userId,
      filePath: testVideoPath,
      sourceImageUrl: '',
      mime: fileMime,
    }

    const result = await testUtils.fictionMedia?.queries.ManageMedia.serve({
      _action: 'checkAndCreate',
      fields: mediaConfig,
      userId,
      orgId,
      noCache: true,
    }, meta)

    const media = result?.data?.[0]
    expect(media?.blurhash).toBeFalsy()
  })

  it('should list and filter video files correctly', async () => {
    // First, upload a video file
    const fileMime = 'video/mp4'
    const mediaConfig: TableMediaConfig = {
      orgId,
      userId,
      filePath: testVideoPath,
      sourceImageUrl: '',
      mime: fileMime,
    }
    await testUtils.fictionMedia?.queries.ManageMedia.serve({
      _action: 'checkAndCreate',
      fields: mediaConfig,
      userId,
      orgId,
      noCache: true,
    }, meta)

    // Now test listing with video filter
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
    expect(listResult?.data?.every(item => item.mime === fileMime)).toBe(true)
  })
})
