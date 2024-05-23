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
        "createdAt": 2024-05-23T08:43:25.094Z,
        "etag": null,
        "filePath": "org664f01ac15389c41840b67ef/med664f01ac65dd623b3a223626-test.jpg",
        "hash": "e641b4e287db381e1499c7575a427e6d6c47ba00b4f4ae1ec3162dcfb4fae1cd",
        "height": 640,
        "isCached": true,
        "mediaId": "med664f01ac65dd623b3a223626",
        "mime": "image/jpeg",
        "orgId": "org664f01ac15389c41840b67ef",
        "orientation": null,
        "originUrl": "https://factor-tests.s3.amazonaws.com/org664f01ac15389c41840b67ef/med664f01ac65dd623b3a223626-test.jpg",
        "preview": null,
        "prompt": null,
        "rasterUrl": null,
        "size": 123812,
        "sourceImageUrl": "",
        "thumbFilePath": null,
        "thumbOriginUrl": "https://factor-tests.s3.amazonaws.com/org664f01ac15389c41840b67ef/med664f01ac65dd623b3a223626-thumb-test.png",
        "thumbUrl": "https://factor-tests.s3.amazonaws.com/org664f01ac15389c41840b67ef/med664f01ac65dd623b3a223626-thumb-test.png?blurhash=UIF68%7C-%3BM%7B%3Fb~qt7WBxu_3-%3B%25MRj%25MofofM%7B",
        "updatedAt": 2024-05-23T08:43:25.093Z,
        "url": "https://factor-tests.s3.amazonaws.com/org664f01ac15389c41840b67ef/med664f01ac65dd623b3a223626-test.jpg?blurhash=UIF68%7C-%3BM%7B%3Fb~qt7WBxu_3-%3B%25MRj%25MofofM%7B",
        "userId": "usr664f01ac861d664184fcc28d",
        "width": 640,
      }
    `)
  })
})
