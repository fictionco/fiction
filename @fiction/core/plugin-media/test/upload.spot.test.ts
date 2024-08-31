/**
 * @vitest-environment happy-dom
 * https://vitest.dev/config/#environment
 */
import fs from 'node:fs'
import { fileFromPath } from 'formdata-node/file-from-path'

import { describe, expect, it } from 'vitest'
import { FormData } from 'formdata-node'
import type { EndpointMeta } from '@fiction/core/utils'
import type { TestUtils } from '../../test-utils/init'
import { createTestUtils } from '../../test-utils/init'
import { testEnvFile, testImgPath } from '../../test-utils'
import { FictionMedia } from '..'
import { FictionAws } from '../../plugin-aws'
import { getEnvVars } from '../../utils'

describe('media upload/download tests', async () => {
  let url: string | undefined

  if (!fs.existsSync(testEnvFile))
    console.warn(`missing test env file ${testEnvFile}`)

  const testUtils = createTestUtils({ envFiles: [testEnvFile] }) as (TestUtils & { fictionMedia?: FictionMedia })

  const v = getEnvVars(testUtils.fictionEnv, ['AWS_ACCESS_KEY', 'AWS_ACCESS_KEY_SECRET', 'UNSPLASH_ACCESS_KEY', 'AWS_BUCKET_MEDIA'] as const)

  const { awsAccessKey, awsAccessKeySecret, unsplashAccessKey, awsBucketMedia } = v

  const fictionAws = new FictionAws({ ...testUtils, awsAccessKey, awsAccessKeySecret })
  testUtils.fictionMedia = new FictionMedia({ ...testUtils, fictionAws, awsBucketMedia, unsplashAccessKey })
  testUtils.initialized = await testUtils.init()

  it('creates media from an external URL', async () => {
    const sourceImageUrl = 'https://images.unsplash.com/photo-1708724195876-1156245fce21'

    // Call the function under test
    const result = await testUtils.fictionMedia?.queries.ManageMedia.serve({
      _action: 'createFromUrl',
      orgId: testUtils.initialized?.orgId || '',
      userId: testUtils.initialized?.user?.userId || '',
      fields: { sourceImageUrl },
    }, {} as EndpointMeta) // Mock the meta as well if needed

    // Assertions to check if the media was created correctly
    expect(result?.status).toBe('success')
    const media = result?.data?.[0]
    expect(media?.url).toContain('fiction-media')
    expect(media?.mime).toBe('image/jpeg') // or the correct mime type

    expect(Object.keys(media || {})).toMatchInlineSnapshot(`
      [
        "orgId",
        "userId",
        "mediaId",
        "caption",
        "hash",
        "url",
        "originUrl",
        "rasterUrl",
        "thumbUrl",
        "thumbOriginUrl",
        "blurhash",
        "thumbFilePath",
        "preview",
        "filePath",
        "mime",
        "width",
        "height",
        "orientation",
        "alt",
        "etag",
        "contentEncoding",
        "bucket",
        "size",
        "prompt",
        "sourceImageUrl",
        "createdAt",
        "updatedAt",
      ]
    `)
  })

  it('uploads a file', async () => {
    const formData = new FormData()
    const f = await fileFromPath(testImgPath, { type: 'image/jpeg' })

    formData.append('field1', 'val1')
    formData.append('field2', 'val2')
    formData.append('imageFile', f)

    const r = await testUtils?.fictionMedia?.uploadFile({ formData })

    expect(r?.data?.mediaId).toBeDefined()

    url = r?.data?.url

    if (!url)
      throw new Error('no url')
    expect(url).toContain('fiction-media')
    expect(url).toContain('test.jpg')
    expect(r?.data?.url).toContain('.jpg')
    expect(r?.message).toMatchInlineSnapshot('"uploaded successfully"')
    expect(r?.data?.mime).toBe('image/jpeg')
    expect(r?.data?.size).toMatchInlineSnapshot(`123812`)
    expect(r?.data?.userId).toBe(testUtils?.initialized?.user?.userId)

    const img = await fetch(url)
    expect(img.status).toBe(200)
  })

  it('gets index of files uploaded', async () => {
    const r = await testUtils?.fictionMedia?.requests.MediaIndex.projectRequest({ _action: 'list' })

    expect(r?.data?.length).toBeGreaterThan(0)
    expect(r?.message).toBeFalsy()
    expect(r?.data?.[0].url).toContain('.jpg')
  })

  it('deletes a file', async () => {
    if (!url)
      throw new Error('no url')

    const img1 = await fetch(url)

    expect(img1.status).toBe(200)

    const r = await testUtils?.fictionMedia?.requests.ManageMedia.projectRequest({
      _action: 'delete',
      where: [{ url }],
    })

    const media = r?.data?.[0]
    expect(media?.mediaId).toBeTruthy()
    expect(r?.message).toMatchInlineSnapshot(`"1 Media items deleted"`)
    expect(r?.status).toBe('success')

    const img2 = await fetch(url)
    expect(img2.status).toBe(404)
  })
})
