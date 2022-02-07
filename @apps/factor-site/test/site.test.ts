import { expect, it, describe } from "vitest"
import { execaCommandSync } from "execa"

describe("factor site", () => {
  it("builds", () => {
    const r = execaCommandSync("npm -w @factor/site exec factor prerender")

    expect(r.stdout).toContain("built successfully")
  })
})
