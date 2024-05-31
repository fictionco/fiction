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
        "createdAt": 2024-05-31T23:00:01.992Z,
        "etag": null,
        "filePath": "org665a567159a3e06538fd31e6/med665a56716b24c062ce89cb21-test.jpg",
        "hash": "e641b4e287db381e1499c7575a427e6d6c47ba00b4f4ae1ec3162dcfb4fae1cd",
        "height": 640,
        "isCached": true,
        "mediaId": "med665a56716b24c062ce89cb21",
        "mime": "image/jpeg",
        "orgId": "org665a567159a3e06538fd31e6",
        "orientation": null,
        "originUrl": "https://fiction-media-dev.s3.amazonaws.com/org665a567159a3e06538fd31e6/med665a56716b24c062ce89cb21-test.jpg?blurhash=UIF68%7C-%3BM%7B%3Fb%7Eqt7WBxu_3-%3B%25MRj%25MofofM%7B",
        "preview": null,
        "prompt": null,
        "rasterUrl": null,
        "size": 123812,
        "sourceImageUrl": "",
        "thumbFilePath": null,
        "thumbOriginUrl": "https://fiction-media-dev.s3.amazonaws.com/org665a567159a3e06538fd31e6/med665a56716b24c062ce89cb21-thumb-test.png",
        "thumbUrl": "https://fiction-media-dev.s3.amazonaws.com/org665a567159a3e06538fd31e6/med665a56716b24c062ce89cb21-thumb-test.png?blurhash=UIF68%7C-%3BM%7B%3Fb%7Eqt7WBxu_3-%3B%25MRj%25MofofM%7B",
        "updatedAt": 2024-05-31T23:00:01.988Z,
        "url": "https://fiction-media-dev.s3.amazonaws.com/org665a567159a3e06538fd31e6/med665a56716b24c062ce89cb21-test.jpg?blurhash=UIF68%7C-%3BM%7B%3Fb%7Eqt7WBxu_3-%3B%25MRj%25MofofM%7B",
        "userId": "usr665a5671000dd865380d351e",
        "width": 640,
      }
    `)
  })
})
