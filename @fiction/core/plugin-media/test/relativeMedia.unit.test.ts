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
        "createdAt": 2024-05-18T08:03:08.116Z,
        "etag": null,
        "filePath": "fiction-relative-media/med664860bbd69da18b6be2655c-test.jpg",
        "hash": "15b0033a19e2f7f598186644c5cc4e8349a6251ad6f3c1caffdb4e3fc71dd443",
        "height": 640,
        "isCached": true,
        "mediaId": "med664860bbd69da18b6be2655c",
        "mime": "image/jpeg",
        "orgId": null,
        "orientation": null,
        "originUrl": "https://factor-tests.s3.amazonaws.com/fiction-relative-media/med664860bbd69da18b6be2655c-test.jpg",
        "preview": null,
        "prompt": null,
        "rasterUrl": null,
        "size": 123812,
        "sourceImageUrl": null,
        "thumbFilePath": null,
        "thumbOriginUrl": "https://factor-tests.s3.amazonaws.com/fiction-relative-media/med664860bbd69da18b6be2655c-thumb-test.png",
        "thumbUrl": "https://factor-tests.s3.amazonaws.com/fiction-relative-media/med664860bbd69da18b6be2655c-thumb-test.png?blurhash=UIF68%7C-%3BM%7B%3Fb~qt7WBxu_3-%3B%25MRj%25MofofM%7B",
        "updatedAt": 2024-05-18T08:03:08.115Z,
        "url": "https://factor-tests.s3.amazonaws.com/fiction-relative-media/med664860bbd69da18b6be2655c-test.jpg?blurhash=UIF68%7C-%3BM%7B%3Fb~qt7WBxu_3-%3B%25MRj%25MofofM%7B",
        "userId": null,
        "width": 640,
      }
    `)
  })
})
