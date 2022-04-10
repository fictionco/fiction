import { describe, it, expect } from "vitest"
import { WriteBuffer } from "../buffer"
import { waitFor } from "../utils"

describe("buffer", () => {
  it("buffers data", async () => {
    const calls: any[] = []
    const buffer = new WriteBuffer({
      maxSeconds: 1,
      limit: 2,
      flush: (items): void => {
        calls.push(items)
      },
    })

    buffer.add("test")
    buffer.add("test")
    buffer.add("test")
    buffer.add("test")
    buffer.add("test")

    await waitFor(2000)

    expect(calls.length).toBe(3)
    expect(calls).toMatchInlineSnapshot(`
      [
        [
          "test",
          "test",
        ],
        [
          "test",
          "test",
        ],
        [
          "test",
        ],
      ]
    `)
  })
})
