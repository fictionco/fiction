import { getSinglePost } from "../../server"
import * as db from "../../database"
jest.mock("../../database")

describe("post permissions", () => {
  it("allows regular posts to be read if published", async () => {
    const mock = jest.spyOn(db, "getModel")

    mock.mockReturnValueOnce({
      // @ts-ignore
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
      // @ts-ignore
      findById: async () => ({ foo: "bar", status: "published" })
    })

    post = await getSinglePost({ _id: "123", postType: "post" }, { bearer: undefined })

    expect(post).toEqual({ foo: "bar", status: "published" })
  })
})
