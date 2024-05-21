import { afterAll, describe, expect, it } from 'vitest'
import fs from 'fs-extra'
import { FictionAws } from '../../plugin-aws'
import { FictionMedia } from '..'
import type { TestUtils } from '../../test-utils'
import { createTestUtils, testEnvFile, testImgPath } from '../../test-utils'

describe('createAndSaveMedia', async () => {
  if (!fs.existsSync(testEnvFile))
    console.warn(`missing test env file ${testEnvFile}`)

  const testUtils = createTestUtils({ envFiles: [testEnvFile] }) as TestUtils & { fictionMedia?: FictionMedia }

  const awsAccessKey = testUtils.fictionEnv.var('AWS_ACCESS_KEY')
  const awsAccessKeySecret = testUtils.fictionEnv.var('AWS_ACCESS_KEY_SECRET')

  if (!awsAccessKey || !awsAccessKeySecret)
    throw new Error(`missing env vars key:${awsAccessKey?.length}, secret:${awsAccessKeySecret?.length}`)

  const fictionAws = new FictionAws({
    fictionEnv: testUtils.fictionEnv,
    awsAccessKey,
    awsAccessKeySecret,
  })
  testUtils.fictionMedia = new FictionMedia({
    ...testUtils,
    fictionAws,
    bucket: 'factor-tests',
  })
  testUtils.initialized = await testUtils.init()

  afterAll(async () => {
    await testUtils.close()
  })

  it('converts a local filepath image to aws link', async () => {
    expect(1).toBe(1)
    const result = await testUtils.fictionMedia?.relativeMedia({ url: testImgPath })

    expect(result).toMatchInlineSnapshot(`
      {
        "alt": null,
        "blurhash": "UIF68|-;M{?b~qt7WBxu_3-;%MRj%MofofM{",
        "bucket": "factor-tests",
        "caption": null,
        "contentEncoding": null,
        "createdAt": 2024-05-18T16:11:36.368Z,
        "etag": null,
        "filePath": "org6648d337ddae682511197d29/med6648d3379d0ee8022429e3fd-test.jpg",
        "hash": "e641b4e287db381e1499c7575a427e6d6c47ba00b4f4ae1ec3162dcfb4fae1cd",
        "height": 640,
        "isCached": true,
        "mediaId": "med6648d3379d0ee8022429e3fd",
        "mime": "image/jpeg",
        "orgId": "org6648d337ddae682511197d29",
        "orientation": null,
        "originUrl": "https://factor-tests.s3.amazonaws.com/org6648d337ddae682511197d29/med6648d3379d0ee8022429e3fd-test.jpg",
        "preview": null,
        "prompt": null,
        "rasterUrl": null,
        "size": 123812,
        "sourceImageUrl": "",
        "thumbFilePath": null,
        "thumbOriginUrl": "https://factor-tests.s3.amazonaws.com/org6648d337ddae682511197d29/med6648d3379d0ee8022429e3fd-thumb-test.png",
        "thumbUrl": "https://factor-tests.s3.amazonaws.com/org6648d337ddae682511197d29/med6648d3379d0ee8022429e3fd-thumb-test.png?blurhash=UIF68%7C-%3BM%7B%3Fb~qt7WBxu_3-%3B%25MRj%25MofofM%7B",
        "updatedAt": 2024-05-18T16:11:36.367Z,
        "url": "https://factor-tests.s3.amazonaws.com/org6648d337ddae682511197d29/med6648d3379d0ee8022429e3fd-test.jpg?blurhash=UIF68%7C-%3BM%7B%3Fb~qt7WBxu_3-%3B%25MRj%25MofofM%7B",
        "userId": "usr6648d33789dc5a2511bcf3df",
        "width": 640,
      }
    `)
  })
})
