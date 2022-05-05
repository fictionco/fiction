import { compileApplication } from "@factor/api/plugin-env/entry"
import { expect, it, describe } from "vitest"

describe("server entry handling", () => {
  it("gets entry and runs server function if exists", async () => {
    const { serviceConfig } = await compileApplication({ isApp: true })

    expect(serviceConfig.server).toBe(undefined)

    expect(Object.keys(serviceConfig)).toMatchInlineSnapshot(`
      [
        "name",
        "paths",
        "vite",
        "service",
      ]
    `)

    expect(Object.keys(serviceConfig.service ?? {})).toMatchInlineSnapshot(`
      [
        "factorApp",
        "factorRouter",
        "factorServer",
        "factorUser",
        "factorDb",
        "factorStripe",
        "factorDocs",
        "factorBlog",
        "factorHighlightCode",
        "factorNotify",
        "factorUi",
      ]
    `)
  })
})