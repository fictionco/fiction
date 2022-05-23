/**
 * @vitest-environment jsdom
 * https://vitest.dev/config/#environment
 */

import nodeFetch from "node-fetch"
import {
  it,
  describe,
  beforeAll,
  expect,
  createTestUtils,
  TestUtils,
} from "../../testUtils"
import { axios } from "../../utils"
import { FactorMedia } from ".."
import { FactorAws } from "../../plugin-aws"
let testUtils: (TestUtils & { factorMedia?: FactorMedia }) | undefined =
  undefined

let url: string | undefined = undefined
const randomImageFile = async () => {
  const response = await axios.default.get<Blob>(
    "https://source.unsplash.com/random",
    {
      responseType: "blob",
    },
  )

  const file = new File([response.data], "random.jpg", { type: "image/jpeg" })

  return file
}

describe("user tests", () => {
  beforeAll(async () => {
    testUtils = await createTestUtils()

    const factorAws = new FactorAws({
      awsAccessKey: testUtils.factorEnv.var("awsAccessKey"),
      awsAccessKeySecret: testUtils.factorEnv.var("awsAccessKeySecret"),
    })
    testUtils.factorMedia = new FactorMedia({
      factorDb: testUtils.factorDb,
      factorUser: testUtils.factorUser,
      factorServer: testUtils.factorServer,
      factorAws,
      bucket: "factor-testing",
      unsplashAccessKey: process.env.UNSPLASH_ACCESS_KEY,
    })
    testUtils.initialized = await testUtils.init()
  })

  it("uploads a file", async () => {
    const file = await randomImageFile()

    const r = await testUtils?.factorMedia?.uploadFile(file)

    expect(r?.data?.mediaId).toBeDefined()

    url = r?.data?.url

    if (!url) throw new Error("no url")
    expect(url).toContain("factor-testing")
    expect(url).toContain("random.jpg")

    expect(r).toMatchInlineSnapshot(`
      {
        "data": {
          "alt": null,
          "bucket": "factor-testing",
          "contentEncoding": null,
          "createdAt": "2022-05-23T21:00:46.319Z",
          "etag": null,
          "filePath": "us628bf5fb2b42d22fed51bf9e/628bf5fc704c52fc975d569c-random.jpg",
          "height": null,
          "mediaId": "628bf5fc704c52fc975d569c",
          "mime": "image/jpeg",
          "size": null,
          "url": "https://factor-testing.s3.amazonaws.com/us628bf5fb2b42d22fed51bf9e/628bf5fc704c52fc975d569c-random.jpg",
          "userId": "us628bf5fb2b42d22fed51bf9e",
          "width": null,
        },
        "message": "uploaded successfully",
        "status": "success",
      }
    `)

    const img = await nodeFetch(url)
    expect(img.status).toBe(200)
  })

  it("gets index of files uploaded", async () => {
    const r = await testUtils?.factorMedia?.requests.MediaIndex.request({
      _action: "list",
    })

    expect(r?.data?.length).toBeGreaterThan(0)
    expect(r?.message).toBeFalsy()
    expect(r).toMatchInlineSnapshot(`
      {
        "data": [
          {
            "alt": null,
            "bucket": "factor-testing",
            "contentEncoding": null,
            "createdAt": "2022-05-23T21:00:46.319Z",
            "etag": null,
            "filePath": "us628bf5fb2b42d22fed51bf9e/628bf5fc704c52fc975d569c-random.jpg",
            "height": null,
            "mediaId": "628bf5fc704c52fc975d569c",
            "mime": "image/jpeg",
            "size": null,
            "url": "https://factor-testing.s3.amazonaws.com/us628bf5fb2b42d22fed51bf9e/628bf5fc704c52fc975d569c-random.jpg",
            "userId": "us628bf5fb2b42d22fed51bf9e",
            "width": null,
          },
        ],
        "message": "",
        "status": "success",
      }
    `)
  })

  it("deletes a file", async () => {
    if (!url) throw new Error("no url")

    const r = await testUtils?.factorMedia?.requests.MediaAction.request({
      _action: "delete",
      url,
      deleteStorage: true,
    })

    const pathname = new URL(url).pathname.replace(/^\/+/g, "")

    expect(pathname).toMatchInlineSnapshot(
      '"us628bf5fb2b42d22fed51bf9e/628bf5fc704c52fc975d569c-random.jpg"',
    )

    expect(r?.data).toMatchInlineSnapshot(`
      [
        {
          "alt": null,
          "bucket": "factor-testing",
          "contentEncoding": null,
          "createdAt": "2022-05-23T21:00:46.319Z",
          "etag": null,
          "filePath": "us628bf5fb2b42d22fed51bf9e/628bf5fc704c52fc975d569c-random.jpg",
          "height": null,
          "mediaId": "628bf5fc704c52fc975d569c",
          "mime": "image/jpeg",
          "size": null,
          "url": "https://factor-testing.s3.amazonaws.com/us628bf5fb2b42d22fed51bf9e/628bf5fc704c52fc975d569c-random.jpg",
          "userId": "us628bf5fb2b42d22fed51bf9e",
          "width": null,
        },
      ]
    `)

    const img = await nodeFetch(url)
    expect(img.status).toBe(403)
  })

  it("gets unsplash photos", async () => {
    const r = await testUtils?.factorMedia?.requests.Unsplash.request({
      _action: "random",
    })

    expect(r?.status).toBe("success")
    const urls = r?.data?.map((d) => d.urls).filter(Boolean)
    expect(urls?.length).toBe(30)

    const r2 = await testUtils?.factorMedia?.requests.Unsplash.request({
      _action: "search",
      query: "dog",
    })

    expect(r2?.status).toBe("success")
    const urls2 = r?.data?.map((d) => d.urls).filter(Boolean)
    expect(urls2?.length).toBe(30)
  })
})
