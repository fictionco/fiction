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

let testUtils: TestUtils & { fictionMedia?: FictionMedia }
let meta: EndpointMeta

describe('createAndSaveMedia', async () => {
  if (!fs.existsSync(testEnvFile))
    console.warn(`missing test env file ${testEnvFile}`)

  testUtils = createTestUtils({ envFiles: [testEnvFile] }) as TestUtils & { fictionMedia?: FictionMedia }

  const awsAccessKey = testUtils.fictionEnv.var('AWS_ACCESS_KEY')
  const awsAccessKeySecret = testUtils.fictionEnv.var('AWS_ACCESS_KEY_SECRET')
  const unsplashAccessKey = testUtils.fictionEnv.var('UNSPLASH_ACCESS_KEY')

  if (!awsAccessKey || !awsAccessKeySecret || !unsplashAccessKey)
    throw new Error(`missing env vars key:${awsAccessKey?.length}, secret:${awsAccessKeySecret?.length}, unsplash${unsplashAccessKey?.length}`)

  const fictionAws = new FictionAws({
    fictionEnv: testUtils.fictionEnv,
    awsAccessKey,
    awsAccessKeySecret,
  })
  testUtils.fictionMedia = new FictionMedia({
    ...testUtils,
    fictionAws,
    bucket: 'factor-tests',
    unsplashAccessKey,
  })
  testUtils.initialized = await testUtils.init()

  meta = {} as EndpointMeta // Mock meta as needed

  afterAll(async () => {
    await testUtils.close()
  })

  it('should create and save media WITHOUT cropping', async () => {
    const fileSource = fs.readFileSync(testImgPath)
    const fileName = path.basename(testImgPath)
    const fileMime = 'image/jpeg'

    const mediaConfig: TableMediaConfig = {
      orgId: testUtils.initialized?.orgId || '',
      userId: testUtils.initialized?.user?.userId || '',
      filePath: testImgPath,
      sourceImageUrl: '',
      mime: fileMime,
    }

    const result = await testUtils.fictionMedia?.queries.ManageMedia.serve({
      _action: 'checkAndCreate',
      fields: mediaConfig,
      userId: testUtils.initialized?.user?.userId || '',
      orgId: testUtils.initialized?.orgId || '',
    }, meta)

    expect(result?.status).toBe('success')
    expect(result?.data?.url).toContain('factor-tests')
    expect(result?.data?.mime).toBe(fileMime)
  })

  it('should create and save media WITH cropping', async () => {
    const fileMime = 'image/jpeg'

    const mediaConfig: TableMediaConfig = {
      orgId: testUtils.initialized?.orgId || '',
      userId: testUtils.initialized?.user?.userId || '',
      filePath: testImgPath,
      sourceImageUrl: '',
      mime: fileMime,
    }

    const crop = { width: 100, height: 100, left: 10, top: 10 }

    const { user: { userId = '' }, orgId } = testUtils.initialized || { user: {}, orgId: '' }
    const checkArgs = { _action: 'checkAndCreate', fields: mediaConfig, userId, orgId, crop } as const

    const result = await testUtils.fictionMedia?.queries.ManageMedia.serve({ ...checkArgs, noCache: false }, meta)

    expect(result?.status).toBe('success')
    expect(result?.data?.url).toContain('factor-tests')
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
      orgId: testUtils.initialized?.orgId || '',
      userId: testUtils.initialized?.user?.userId || '',
      filePath: testImgPath,
      sourceImageUrl: '',
      mime: fileMime,
    }

    const result = await testUtils.fictionMedia?.queries.ManageMedia.run({
      _action: 'checkAndCreate',
      fields: mediaConfig,
      userId: testUtils.initialized?.user?.userId || '',
      orgId: testUtils.initialized?.orgId || '',
    }, meta)

    expect(result?.status).toBe('success')
    expect(result?.data?.url).toContain('factor-tests')
    expect(result?.data?.mime).toBe(fileMime)

    // Additional assertions for different image types can be added here
  })

  it('should throw an error if no file is provided', async () => {
    const mediaConfig: TableMediaConfig = {
      orgId: testUtils.initialized?.orgId || '',
      userId: testUtils.initialized?.user?.userId || '',
      filePath: '',
      sourceImageUrl: '',
      mime: '',
    }

    const result = await testUtils.fictionMedia?.queries.ManageMedia.serve({
      _action: 'checkAndCreate',
      fields: mediaConfig,
      userId: testUtils.initialized?.user?.userId || '',
      orgId: testUtils.initialized?.orgId || '',
    }, meta)

    expect(result?.status).toBe('error')
    expect(result?.message).toBe('File path is required for checkAndCreate action.')
  })
})
