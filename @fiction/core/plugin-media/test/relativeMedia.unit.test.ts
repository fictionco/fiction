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
        "createdAt": "2025-02-10 15:12:53.451063+00",
        "duration": null,
        "etag": null,
        "filePath": "org67aa177045c293025befe29d/med67aa17789b9d28e901339460-test.jpg",
        "hash": "e641b4e287db381e1499c7575a427e6d6c47ba00b4f4ae1ec3162dcfb4fae1cd",
        "height": 640,
        "isCached": true,
        "mediaId": "med67aa17789b9d28e901339460",
        "mime": "image/jpeg",
        "orgId": "org67aa177045c293025befe29d",
        "orientation": null,
        "originUrl": "https://fiction-media-dev.s3.amazonaws.com/org67aa177045c293025befe29d/med67aa17789b9d28e901339460-test.jpg?blurhash=UIF68%7C-%3BM%7B%3Fb%7Eqt7WBxu_3-%3B%25MRj%25MofofM%7B",
        "preview": null,
        "prompt": null,
        "rasterUrl": null,
        "size": 123812,
        "sourceImageUrl": "",
        "tags": null,
        "thumbFilePath": null,
        "thumbOriginUrl": "https://fiction-media-dev.s3.amazonaws.com/org67aa177045c293025befe29d/med67aa17789b9d28e901339460-thumb-test.png?blurhash=UIF68%7C-%3BM%7B%3Fb%7Eqt7WBxu_3-%3B%25MRj%25MofofM%7B",
        "thumbUrl": "https://fiction-media-dev.s3.amazonaws.com/org67aa177045c293025befe29d/med67aa17789b9d28e901339460-test.jpg?blurhash=UIF68%7C-%3BM%7B%3Fb%7Eqt7WBxu_3-%3B%25MRj%25MofofM%7B",
        "updatedAt": "2025-02-10T15:12:56.889Z",
        "url": "https://fiction-media-dev.s3.amazonaws.com/org67aa177045c293025befe29d/med67aa17789b9d28e901339460-test.jpg?blurhash=UIF68%7C-%3BM%7B%3Fb%7Eqt7WBxu_3-%3B%25MRj%25MofofM%7B",
        "userId": "usr67aa177027ee8b0336e9f882",
        "width": 640,
      }
    `)
  })
})
