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
        "createdAt": "2024-09-24 21:40:51.05423+00",
        "duration": null,
        "etag": null,
        "filePath": "org66f331e113e3e1fedcfc6ffd/med66f331e5fd55725dc2f1b8b3-test.jpg",
        "hash": "e641b4e287db381e1499c7575a427e6d6c47ba00b4f4ae1ec3162dcfb4fae1cd",
        "height": 640,
        "isCached": true,
        "mediaId": "med66f331e5fd55725dc2f1b8b3",
        "mime": "image/jpeg",
        "orgId": "org66f331e113e3e1fedcfc6ffd",
        "orientation": null,
        "originUrl": "https://fiction-media-dev.s3.amazonaws.com/org66f331e113e3e1fedcfc6ffd/med66f331e5fd55725dc2f1b8b3-test.jpg?blurhash=UIF68%7C-%3BM%7B%3Fb%7Eqt7WBxu_3-%3B%25MRj%25MofofM%7B",
        "preview": null,
        "prompt": null,
        "rasterUrl": null,
        "size": 123812,
        "sourceImageUrl": null,
        "thumbFilePath": null,
        "thumbOriginUrl": "https://fiction-media-dev.s3.amazonaws.com/org66f331e113e3e1fedcfc6ffd/med66f331e5fd55725dc2f1b8b3-thumb-test.png?blurhash=UIF68%7C-%3BM%7B%3Fb%7Eqt7WBxu_3-%3B%25MRj%25MofofM%7B",
        "thumbUrl": "https://fiction-media-dev.s3.amazonaws.com/org66f331e113e3e1fedcfc6ffd/med66f331e5fd55725dc2f1b8b3-test.jpg?blurhash=UIF68%7C-%3BM%7B%3Fb%7Eqt7WBxu_3-%3B%25MRj%25MofofM%7B",
        "updatedAt": "2024-09-24T21:40:53.692Z",
        "url": "https://fiction-media-dev.s3.amazonaws.com/org66f331e113e3e1fedcfc6ffd/med66f331e5fd55725dc2f1b8b3-test.jpg?blurhash=UIF68%7C-%3BM%7B%3Fb%7Eqt7WBxu_3-%3B%25MRj%25MofofM%7B",
        "userId": "usr66f331e119d9960ffc71b491",
        "width": 640,
      }
    `)
  })
})
