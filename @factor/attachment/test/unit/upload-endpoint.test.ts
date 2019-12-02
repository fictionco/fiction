/**
 * @jest-environment node
 */

import fs from "fs"
import { getPort } from "@test/utils"

import { startEndpointTestingServer, stopEndpointTestingServer } from "@test/utils/mongod"
import FormData from "form-data"
import { uploadEndpointPath } from "../../util"
import "../../server"
import { resolve } from "path"
import { authorizedRequest, endpointRequest } from "@factor/endpoint"

import * as filters from "@factor/tools/filters"

jest.setTimeout(120000) // needs to download mongodb 60mb
let port
let __id
let spies
describe("upload endpoint", () => {
  beforeAll(async () => {
    port = await getPort()
    process.env.PORT = String(port)

    spies = {
      applyFilters: jest.spyOn(filters, "applyFilters")
    }

    await startEndpointTestingServer({ port })
  })

  // Close server and ask to stop listening to file changes
  afterAll(async () => {
    await stopEndpointTestingServer()
  })

  it("processes uploaded images", async () => {
    const form = new FormData()

    form.append(
      "imageUpload",
      fs.createReadStream(resolve(__dirname, `./test-image.jpg`))
    )

    const { data } = await authorizedRequest(uploadEndpointPath(), form, {
      headers: form.getHeaders()
    })

    const {
      result: { _id, size, url, mimetype, postType }
    } = data

    __id = _id

    expect(size).toBe(1383)

    expect(url).toContain(
      "data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAA8AAD/4QMfaHR0c"
    )

    expect(mimetype).toBe("image/jpeg")

    expect(postType).toBe("attachment")

    expect(spies.applyFilters).toHaveBeenCalledWith(
      "storage-attachment-url",
      expect.any(Object)
    )
  })

  it("allows for attachment delete", async () => {
    const r = await endpointRequest({
      id: "storage",
      method: "deleteImage",
      params: { _id: __id }
    })

    expect(r._id).toBe(__id)
  })
})
