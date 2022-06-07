import { describe, test, expect } from "@factor/api/testUtils"
import { isJson, groupBy } from "../utils"

describe("utils", () => {
  test("isJson", async () => {
    const invalid = isJson("not valid json")
    const valid = isJson(`{"valid": "yes"}`)
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
