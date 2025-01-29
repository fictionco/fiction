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
        "createdAt": "2025-01-29 20:26:00.894861+00",
        "duration": null,
        "etag": null,
        "filePath": "org679a8ed718e6479328667ab2/med679a8edbe8f5a1060fbc4f8d-test.jpg",
        "hash": "e641b4e287db381e1499c7575a427e6d6c47ba00b4f4ae1ec3162dcfb4fae1cd",
        "height": 640,
        "isCached": true,
        "mediaId": "med679a8edbe8f5a1060fbc4f8d",
        "mime": "image/jpeg",
        "orgId": "org679a8ed718e6479328667ab2",
        "orientation": null,
        "originUrl": "https://fiction-media-dev.s3.amazonaws.com/org679a8ed718e6479328667ab2/med679a8edbe8f5a1060fbc4f8d-test.jpg?blurhash=UIF68%7C-%3BM%7B%3Fb%7Eqt7WBxu_3-%3B%25MRj%25MofofM%7B",
        "preview": null,
        "prompt": null,
        "rasterUrl": null,
        "size": 123812,
        "sourceImageUrl": "",
        "tags": null,
        "thumbFilePath": null,
        "thumbOriginUrl": "https://fiction-media-dev.s3.amazonaws.com/org679a8ed718e6479328667ab2/med679a8edbe8f5a1060fbc4f8d-thumb-test.png?blurhash=UIF68%7C-%3BM%7B%3Fb%7Eqt7WBxu_3-%3B%25MRj%25MofofM%7B",
        "thumbUrl": "https://fiction-media-dev.s3.amazonaws.com/org679a8ed718e6479328667ab2/med679a8edbe8f5a1060fbc4f8d-test.jpg?blurhash=UIF68%7C-%3BM%7B%3Fb%7Eqt7WBxu_3-%3B%25MRj%25MofofM%7B",
        "updatedAt": "2025-01-29T20:26:04.263Z",
        "url": "https://fiction-media-dev.s3.amazonaws.com/org679a8ed718e6479328667ab2/med679a8edbe8f5a1060fbc4f8d-test.jpg?blurhash=UIF68%7C-%3BM%7B%3Fb%7Eqt7WBxu_3-%3B%25MRj%25MofofM%7B",
        "userId": "usr679a8ed7d8d23784dd24217e",
        "width": 640,
      }
    `)
  })
})
