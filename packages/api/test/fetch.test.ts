/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect } from "vitest"
import { fetchAdvanced, $fetch } from "../utils/fetch"

describe("fetch", () => {
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

  it("runs ohmyfetch", async () => {
    const result = await $fetch<Record<string, any>>(
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
