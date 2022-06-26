/**
 * @vitest-environment jsdom
 * https://vitest.dev/config/#environment
 */

import indexedDB from "fake-indexeddb"
import IDBKeyRange from "fake-indexeddb/lib/FDBKeyRange"
import { expect, it, describe, beforeAll } from "../../testUtils"
import { FactorIndexedDb } from "../idb"

describe("replay tag", () => {
  beforeAll(async () => {
    window.indexedDB = indexedDB
    window.IDBKeyRange = IDBKeyRange
  })

  it("handles messages from server", async () => {
    const db = new FactorIndexedDb({
      dbName: "test",
      tableName: "test",
      indexes: [{ name: "testId" }],
    })

    await db.initialized

    for (let i = 0; i < 10; i++) {
      await db.insert({ testId: `testValue`, data: [i] })
    }

    const results = await db.retrieveByField({
      field: "testId",
      value: "testValue",
    })

    expect(results.length).toBe(10)
    expect(results).toMatchInlineSnapshot(`
      [
        {
          "data": [
            0,
          ],
          "testId": "testValue",
        },
        {
          "data": [
            1,
          ],
          "testId": "testValue",
        },
        {
          "data": [
            2,
          ],
          "testId": "testValue",
        },
        {
          "data": [
            3,
          ],
          "testId": "testValue",
        },
        {
          "data": [
            4,
          ],
          "testId": "testValue",
        },
        {
          "data": [
            5,
          ],
          "testId": "testValue",
        },
        {
          "data": [
            6,
          ],
          "testId": "testValue",
        },
        {
          "data": [
            7,
          ],
          "testId": "testValue",
        },
        {
          "data": [
            8,
          ],
          "testId": "testValue",
        },
        {
          "data": [
            9,
          ],
          "testId": "testValue",
        },
      ]
    `)

    const deleteResult = await db.deleteByField({
      field: "testId",
      value: "testValue",
    })

    expect(deleteResult).toBe(10)

    const afterDeleteResult = await db.retrieveByField({
      field: "testId",
      value: "testValue",
    })

    expect(afterDeleteResult).toMatchInlineSnapshot("[]")

    for (let i = 0; i < 3; i++) {
      await db.insert({ testId: `testValue`, data: [i] })
    }

    const results2 = await db.getAll()

    expect(results2.length).toBe(3)

    await db.clearTable()

    const results3 = await db.getAll()

    expect(results3.length).toBe(0)
  })
})
