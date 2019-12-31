/**
 * @jest-environment node
 */
/* eslint-disable import/order */
import "../../server"

import * as filters from "@factor/api/hooks"

import * as endpoint from "@factor/endpoint"
import * as endpointServer from "@factor/endpoint/server"
import { mockUser, getPort } from "@test/utils"
import { startEndpointTestingServer, stopEndpointTestingServer } from "@test/utils/mongod"
import { CurrentUserState, UserRoles } from "@factor/user/types"
import FormData from "form-data"
import fs from "fs"

import { resolve } from "path"
import { uploadEndpointPath } from "../../util"

jest.setTimeout(120000) // needs to download mongodb 60mb
let port

jest.spyOn(endpointServer, "setAuthorizedUser").mockImplementation(
  async (): Promise<CurrentUserState> => {
    return mockUser(UserRoles.Admin)
  }
)

let __id: string
const spies = {
  applyFilters: jest.spyOn(filters, "applyFilters")
}
describe("upload endpoint", () => {
  beforeAll(async () => {
    port = await getPort()
    process.env.PORT = String(port)

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

    const response = await endpoint.authorizedRequest(uploadEndpointPath(), form, {
      headers: form.getHeaders()
    })

    const {
      result: { _id, size, url, mimetype, postType }
    } = response.data

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
    const r = (await endpoint.endpointRequest({
      id: "storage",
      method: "deleteImage",
      params: { _id: __id }
    })) as { _id: string }

    expect(r._id).toBe(__id)
  })
})
