import { getSinglePost, savePost } from "@factor/post/server"
import * as db from "@factor/post/database"
import { FactorPost } from "@factor/post/types"

/**
 * Mongoose has some gnarly type handling which jest handles as generics
 * impossible to duplicate, so we bail with <any>
 */
const mock = jest.spyOn<any, "getModel">(db, "getModel")

describe("page templates", () => {
  it.todo("renders page templates correctly")

  it.todo("adds a default page")
})

describe("page template permissions", () => {
  it("prevents viewing of drafts to non-moderators", async () => {
    let post: FactorPost | void
    mock.mockReturnValueOnce({
      findById: async () => ({ page: "data" })
    })

    let e

    try {
      post = await getSinglePost({ _id: "123", postType: "page" }, { bearer: undefined })
    } catch (error) {
      e = error
    }

    expect(post).toBeFalsy()
    expect(e.message).toContain("Insufficient permissions")
  })

  it("Allows view of published pages", async () => {
    mock.mockReturnValueOnce({
      findById: async () => ({ page: "data", status: "published" })
    })

    const post: FactorPost | void = await getSinglePost(
      { _id: "123", postType: "page" },
      { bearer: undefined }
    )
    expect(post).toBeTruthy()
    expect(post).toEqual({ page: "data", status: "published" })
  })

  it("Only allows 100+ accessLevel to create pages", async () => {
    let post: FactorPost | void
    let eCreate
    try {
      post = await savePost(
        { data: { title: "My Page" }, postType: "page" },
        { bearer: undefined }
      )
    } catch (error) {
      eCreate = error
    }
    expect(post).toBeFalsy()
    expect(eCreate.message).toContain("Insufficient permissions")
  })
})
