import { getSinglePost } from "../../server"
import * as db from "../../database"
jest.mock("../../database")

describe("post permissions", () => {
  it("allows regular posts to be read if published", async () => {
    /**
     * Mongoose has some gnarly type handling which jest handles as generics
     * impossible to duplicate, so we bail with <any>
     */
    const mock = jest.spyOn<any, "getModel">(db, "getModel")

    mock.mockReturnValueOnce({
      findById: async () => ({ foo: "bar" })
    })

    let e
    let post
    try {
      post = await getSinglePost({ _id: "123", postType: "post" }, { bearer: undefined })
    } catch (error) {
      e = error
    }

    expect(e.message).toContain("Insufficient permissions")

    mock.mockReturnValueOnce({
      findById: async () => ({ foo: "bar", status: "published" })
    })

    post = await getSinglePost({ _id: "123", postType: "post" }, { bearer: undefined })

    expect(post).toEqual({ foo: "bar", status: "published" })
  })
})
