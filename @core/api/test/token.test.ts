/**
 * @vitest-environment jsdom
 * https://vitest.dev/config/#environment
 */
import { expect, describe, it } from "vitest"
import { clientToken } from "../jwt"
import { getCookie, getTopDomain } from "../cookie"

describe("user token", () => {
  it("saves the token in a parent domain cookie", () => {
    clientToken({ action: "set", token: "test" })
    const cookieToken = getCookie("ffUser")

    expect(cookieToken).toEqual("test")
    expect(getTopDomain()).toEqual("localhost")
  })

  it("gets token", () => {
    const token = clientToken({ action: "get" })
    expect(token).toEqual("test")
  })

  it("removes the token", () => {
    clientToken({ action: "destroy" })
    const cookieToken = getCookie("ffUser")

    expect(cookieToken).toBeFalsy()
  })
})
