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
        "createdAt": "2025-01-18 03:09:36.057325+00",
        "duration": null,
        "etag": null,
        "filePath": "org678b1b6fec257020af7cb786/med678b1b72bc1d7127655ff688-test.jpg",
        "hash": "e641b4e287db381e1499c7575a427e6d6c47ba00b4f4ae1ec3162dcfb4fae1cd",
        "height": 640,
        "isCached": true,
        "mediaId": "med678b1b72bc1d7127655ff688",
        "mime": "image/jpeg",
        "orgId": "org678b1b6fec257020af7cb786",
        "orientation": null,
        "originUrl": "https://fiction-media-dev.s3.amazonaws.com/org678b1b6fec257020af7cb786/med678b1b72bc1d7127655ff688-test.jpg?blurhash=UIF68%7C-%3BM%7B%3Fb%7Eqt7WBxu_3-%3B%25MRj%25MofofM%7B",
        "preview": null,
        "prompt": null,
        "rasterUrl": null,
        "size": 123812,
        "sourceImageUrl": null,
        "tags": null,
        "thumbFilePath": null,
        "thumbOriginUrl": "https://fiction-media-dev.s3.amazonaws.com/org678b1b6fec257020af7cb786/med678b1b72bc1d7127655ff688-thumb-test.png?blurhash=UIF68%7C-%3BM%7B%3Fb%7Eqt7WBxu_3-%3B%25MRj%25MofofM%7B",
        "thumbUrl": "https://fiction-media-dev.s3.amazonaws.com/org678b1b6fec257020af7cb786/med678b1b72bc1d7127655ff688-test.jpg?blurhash=UIF68%7C-%3BM%7B%3Fb%7Eqt7WBxu_3-%3B%25MRj%25MofofM%7B",
        "updatedAt": "2025-01-18T03:09:38.594Z",
        "url": "https://fiction-media-dev.s3.amazonaws.com/org678b1b6fec257020af7cb786/med678b1b72bc1d7127655ff688-test.jpg?blurhash=UIF68%7C-%3BM%7B%3Fb%7Eqt7WBxu_3-%3B%25MRj%25MofofM%7B",
        "userId": "usr678b1b6fffbaf94d303db415",
        "width": 640,
      }
    `)
  })
})
