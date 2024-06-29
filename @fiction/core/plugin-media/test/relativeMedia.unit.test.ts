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

  afterAll(async () => testUtils.close())

  it('converts a local filepath image to aws link', async () => {
    expect(1).toBe(1)
    const result = await testUtils.fictionMedia?.relativeMedia({ url: testImgPath })

    expect(result).toMatchInlineSnapshot(`
      {
        "alt": null,
        "blurhash": "UIF68|-;M{?b~qt7WBxu_3-;%MRj%MofofM{",
        "bucket": "fiction-media-prod",
        "caption": null,
        "contentEncoding": null,
        "createdAt": 2024-06-13T23:06:49.577Z,
        "etag": null,
        "filePath": "org666b58f52e2c5d2876a308e0/med666b7b8818649cd2762db8e4-socrates.jpg",
        "hash": "e641b4e287db381e1499c7575a427e6d6c47ba00b4f4ae1ec3162dcfb4fae1cd",
        "height": 640,
        "isCached": true,
        "mediaId": "med666b7b8818649cd2762db8e4",
        "mime": "image/jpeg",
        "orgId": "org666b58f52e2c5d2876a308e0",
        "orientation": null,
        "originUrl": "https://fiction-media-prod.s3.amazonaws.com/org666b58f52e2c5d2876a308e0/med666b7b8818649cd2762db8e4-socrates.jpg?blurhash=UIF68%7C-%3BM%7B%3Fb%7Eqt7WBxu_3-%3B%25MRj%25MofofM%7B",
        "preview": null,
        "prompt": null,
        "rasterUrl": null,
        "size": 123812,
        "sourceImageUrl": null,
        "thumbFilePath": null,
        "thumbOriginUrl": "https://fiction-media-prod.s3.amazonaws.com/org666b58f52e2c5d2876a308e0/med666b7b8818649cd2762db8e4-thumb-socrates.png?blurhash=UIF68%7C-%3BM%7B%3Fb%7Eqt7WBxu_3-%3B%25MRj%25MofofM%7B",
        "thumbUrl": "https://media.fiction.com/org666b58f52e2c5d2876a308e0/med666b7b8818649cd2762db8e4-thumb-socrates.png?blurhash=UIF68%7C-%3BM%7B%3Fb%7Eqt7WBxu_3-%3B%25MRj%25MofofM%7B",
        "updatedAt": 2024-06-13T23:06:49.574Z,
        "url": "https://media.fiction.com/org666b58f52e2c5d2876a308e0/med666b7b8818649cd2762db8e4-socrates.jpg?blurhash=UIF68%7C-%3BM%7B%3Fb%7Eqt7WBxu_3-%3B%25MRj%25MofofM%7B",
        "userId": "usr666b58f5a801862876f79cf6",
        "width": 640,
      }
    `)
  })
})
