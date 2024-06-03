import { afterAll, describe, expect, it } from 'vitest'
import fs from 'fs-extra'
import { FictionAws } from '../../plugin-aws'
import { FictionMedia } from '..'
import type { TestUtils } from '../../test-utils'
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

  afterAll(() => testUtils.close())

  it('converts a local filepath image to aws link', async () => {
    expect(1).toBe(1)
    const result = await testUtils.fictionMedia?.relativeMedia({ url: testImgPath })

    expect(result).toMatchInlineSnapshot(`
      {
        "alt": null,
        "blurhash": "UIF68|-;M{?b~qt7WBxu_3-;%MRj%MofofM{",
        "bucket": "fiction-media-dev",
        "caption": null,
        "contentEncoding": null,
        "createdAt": 2024-06-01T07:34:28.996Z,
        "etag": null,
        "filePath": "org665ad46f6c124a6987013e90/med665ad470aaedb1af0bd3098f-test.jpg",
        "hash": "e641b4e287db381e1499c7575a427e6d6c47ba00b4f4ae1ec3162dcfb4fae1cd",
        "height": 640,
        "isCached": true,
        "mediaId": "med665ad470aaedb1af0bd3098f",
        "mime": "image/jpeg",
        "orgId": "org665ad46f6c124a6987013e90",
        "orientation": null,
        "originUrl": "https://fiction-media-dev.s3.amazonaws.com/org665ad46f6c124a6987013e90/med665ad470aaedb1af0bd3098f-test.jpg?blurhash=UIF68%7C-%3BM%7B%3Fb%7Eqt7WBxu_3-%3B%25MRj%25MofofM%7B",
        "preview": null,
        "prompt": null,
        "rasterUrl": null,
        "size": 123812,
        "sourceImageUrl": "",
        "thumbFilePath": null,
        "thumbOriginUrl": "https://fiction-media-dev.s3.amazonaws.com/org665ad46f6c124a6987013e90/med665ad470aaedb1af0bd3098f-thumb-test.png?blurhash=UIF68%7C-%3BM%7B%3Fb%7Eqt7WBxu_3-%3B%25MRj%25MofofM%7B",
        "thumbUrl": "https://fiction-media-dev.s3.amazonaws.com/org665ad46f6c124a6987013e90/med665ad470aaedb1af0bd3098f-test.jpg?blurhash=UIF68%7C-%3BM%7B%3Fb%7Eqt7WBxu_3-%3B%25MRj%25MofofM%7B",
        "updatedAt": 2024-06-01T07:57:36.974Z,
        "url": "https://fiction-media-dev.s3.amazonaws.com/org665ad46f6c124a6987013e90/med665ad470aaedb1af0bd3098f-test.jpg?blurhash=UIF68%7C-%3BM%7B%3Fb%7Eqt7WBxu_3-%3B%25MRj%25MofofM%7B",
        "userId": "usr665ad46f4ded716987e17f8c",
        "width": 640,
      }
    `)
  })
})
