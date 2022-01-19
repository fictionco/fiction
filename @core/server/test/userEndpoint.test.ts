import { assert, expect, test, vi } from "vitest"
import * as ep from "../user/serverUser"

vi.mock("../user/serverUser", async () => {
  console.warn("start...")
  const actual = await vi.importActual("../user/serverUser")
  console.warn("resp;ve...")
  return actual
})

test("newVerificationCode", async () => {
  console.warn("???", ep)
  const input = {
    foo: "hello",
    bar: "world",
  }

  const output = JSON.stringify(input)

  expect(output).eq('{"foo":"hello","bar":"world"}')
  assert.deepEqual(JSON.parse(output), input, "matches original")
})