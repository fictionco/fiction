import path from 'node:path'
import { afterAll, describe, expect, it } from 'vitest'
import fs from 'fs-extra'
import type { EndpointMeta } from '@fiction/core/utils'
import sharp from 'sharp'
import type { TableMediaConfig } from '@fiction/core'
import { createTestUtils } from '../../test-utils/init'
import { FictionMedia } from '..'
import { FictionAws } from '../../plugin-aws'
import { testEnvFile, testImgPath } from '../../test-utils'
import type { TestUtils } from '../../test-utils/init'
import { getEnvVars } from '../../utils'

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
    // const fileSource = fs.readFileSync(testImgPath)
    // const fileName = path.basename(testImgPath)
    const fileMime = 'image/jpeg'

    const mediaConfig: TableMediaConfig = { orgId, userId, filePath: testImgPath, sourceImageUrl: '', mime: fileMime }

    const fields = mediaConfig
    const result = await testUtils.fictionMedia?.queries.ManageMedia.serve({ _action: 'checkAndCreate', noCache: true, fields, userId, orgId }, meta)

    expect(result?.status).toBe('success')
    expect(result?.data?.url).toContain('fiction-media')
    expect(result?.data?.mime).toBe(fileMime)

    const result2 = await fictionMediaCdn.queries.ManageMedia.serve({ _action: 'checkAndCreate', noCache: true, fields, userId, orgId }, meta)

    expect(result2?.status).toBe('success')
    expect(result2?.data?.url).toContain('https://media.fiction.com')
    expect(result2?.data?.originUrl, 'originUrl is aws url').toContain('fiction-media')
  })

  it('should create and save media WITH cropping', async () => {
    const fileMime = 'image/jpeg'

    const mediaConfig: TableMediaConfig = { orgId, userId, filePath: testImgPath, sourceImageUrl: '', mime: fileMime }

    const crop = { width: 100, height: 100, left: 10, top: 10 }

    const checkArgs = { _action: 'checkAndCreate', fields: mediaConfig, userId, orgId, crop } as const

    const result = await testUtils.fictionMedia?.queries.ManageMedia.serve({ ...checkArgs, noCache: true }, meta)

    expect(result?.status).toBe('success')
    expect(result?.data?.url).toContain('fiction-media')
    expect(result?.data?.mime).toBe(fileMime)

    // Download the image from the URL
    const imageUrl = result?.data?.url?.split('?')[0] // Remove query params

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
    expect(result?.data?.url).toContain('fiction-media')
    expect(result?.data?.mime).toBe(fileMime)

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
})
