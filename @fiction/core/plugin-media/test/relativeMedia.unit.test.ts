import type { TestUtils } from '../../test-utils'
import fs from 'fs-extra'
import { afterAll, describe, expect, it } from 'vitest'
import { FictionMedia } from '..'
import { FictionAws } from '../../plugin-aws'
import { createTestUtils, testEnvFile, testImgPath } from '../../test-utils'
import { getEnvVars } from '../../utils'

describe('createAndSaveMedia', async () => {
  if (!fs.existsSync(testEnvFile))
    console.warn(`missing test env file ${testEnvFile}`)

  const testUtils = createTestUtils({ envFiles: [testEnvFile] }) as TestUtils & { fictionMedia?: FictionMedia }

  const v = getEnvVars(testUtils.fictionEnv, ['AWS_ACCESS_KEY', 'AWS_ACCESS_KEY_SECRET', 'AWS_BUCKET_MEDIA'] as const)

  const { awsAccessKey, awsAccessKeySecret, awsBucketMedia } = v

  const fictionAws = new FictionAws({ ...testUtils, awsAccessKey, awsAccessKeySecret })
  testUtils.fictionMedia = new FictionMedia({ ...testUtils, fictionAws, awsBucketMedia })
  testUtils.initialized = await testUtils.init()

  afterAll(async () => testUtils.close())

  it('converts a local filepath image to aws link', async () => {
    expect(1).toBe(1)
    const result = await testUtils.fictionMedia?.relativeMedia({ url: testImgPath, orgId: testUtils.initialized?.orgId })

    expect(result).toMatchInlineSnapshot(`
      {
        "alt": null,
        "blurhash": "UIF68|-;M{?b~qt7WBxu_3-;%MRj%MofofM{",
        "bucket": "fiction-media-dev",
        "caption": null,
        "contentEncoding": null,
        "createdAt": "2024-09-13 01:53:39.157671+00",
        "duration": null,
        "etag": null,
        "filePath": "org66e39b21951ff2490f5fa126/med66e39b25471c22390fce8f21-test.jpg",
        "hash": "e641b4e287db381e1499c7575a427e6d6c47ba00b4f4ae1ec3162dcfb4fae1cd",
        "height": 640,
        "isCached": true,
        "mediaId": "med66e39b25471c22390fce8f21",
        "mime": "image/jpeg",
        "orgId": "org66e39b21951ff2490f5fa126",
        "orientation": null,
        "originUrl": "https://fiction-media-dev.s3.amazonaws.com/org66e39b21951ff2490f5fa126/med66e39b25471c22390fce8f21-test.jpg?blurhash=UIF68%7C-%3BM%7B%3Fb%7Eqt7WBxu_3-%3B%25MRj%25MofofM%7B",
        "preview": null,
        "prompt": null,
        "rasterUrl": null,
        "size": 123812,
        "sourceImageUrl": null,
        "thumbFilePath": null,
        "thumbOriginUrl": "https://fiction-media-dev.s3.amazonaws.com/org66e39b21951ff2490f5fa126/med66e39b25471c22390fce8f21-thumb-test.png?blurhash=UIF68%7C-%3BM%7B%3Fb%7Eqt7WBxu_3-%3B%25MRj%25MofofM%7B",
        "thumbUrl": "https://fiction-media-dev.s3.amazonaws.com/org66e39b21951ff2490f5fa126/med66e39b25471c22390fce8f21-test.jpg?blurhash=UIF68%7C-%3BM%7B%3Fb%7Eqt7WBxu_3-%3B%25MRj%25MofofM%7B",
        "updatedAt": "2024-09-13T01:53:42.113Z",
        "url": "https://fiction-media-dev.s3.amazonaws.com/org66e39b21951ff2490f5fa126/med66e39b25471c22390fce8f21-test.jpg?blurhash=UIF68%7C-%3BM%7B%3Fb%7Eqt7WBxu_3-%3B%25MRj%25MofofM%7B",
        "userId": "usr66e39b210d0f0b0a7d7fdee1",
        "width": 640,
      }
    `)
  })
})
