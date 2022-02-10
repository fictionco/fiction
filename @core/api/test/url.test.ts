import { expect, it, describe } from "vitest"
import { currentUrl, serverUrl } from "../url"

describe("test url methods", () => {
  it("returns local app url", () => {
    process.env.PORT_APP = "4242"

    const result = currentUrl()

    expect(result).toBe("http://localhost:4242")
  })

  it("returns local server url", () => {
    process.env.PORT = "5252"

    const result = serverUrl()

    expect(result).toBe("http://localhost:5252")
  })
})
