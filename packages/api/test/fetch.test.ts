/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect } from "vitest"
import { fetchAdvanced } from "../fetch"

describe("fetch", () => {
  it("fetches data", async () => {
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
