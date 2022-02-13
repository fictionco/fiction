import { describe, test, expect } from "vitest"
import { isValidJson, groupBy } from "../utils"

describe("utils", () => {
  test("isValidJson", async () => {
    const invalid = isValidJson("not valid json")
    const valid = isValidJson(`{"valid": "yes"}`)
    expect(invalid).toBeFalsy()
    expect(valid).toBeTruthy()
  })

  test("groupBy", async () => {
    const data = [
      { animal: "ape", age: 10 },
      { animal: "ape", age: 12 },
      { animal: "giraffe", age: 12 },
      { animal: "giraffe", age: 3 },
    ]
    const result = groupBy(data, "animal")
    expect(result).toMatchInlineSnapshot(`
      {
        "ape": [
          {
            "age": 10,
            "animal": "ape",
          },
          {
            "age": 12,
            "animal": "ape",
          },
        ],
        "giraffe": [
          {
            "age": 12,
            "animal": "giraffe",
          },
          {
            "age": 3,
            "animal": "giraffe",
          },
        ],
      }
    `)
  })
})
