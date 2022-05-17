/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect } from "@factor/api/testUtils"
import { fetchAdvanced } from "@factor/api/utils/fetch"

describe("fetch", () => {
  it("has window and fetch", () => {
    expect(typeof window).toMatchInlineSnapshot('"object"')
    expect(typeof window.fetch).toMatchInlineSnapshot('"function"')
    expect(typeof fetch).toMatchInlineSnapshot('"function"')
  })
  it("fetch advanced with timeout", async () => {
    const result = await fetchAdvanced<Record<string, any>>(
      "https://jsonplaceholder.typicode.com/todos/1",
    )

    expect(result).toMatchInlineSnapshot(`
      {
        "completed": false,
        "id": 1,
        "title": "delectus aut autem",
        "userId": 1,
      }
    `)
  })
})
