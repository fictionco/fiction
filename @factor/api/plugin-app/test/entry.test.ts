import { compileApplication } from "@factor/api/plugin-env/entry"
import { expect, it, describe } from "@factor/api/testUtils"

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
        "factorEnv",
        "factorApp",
        "factorRouter",
        "factorServer",
        "factorUser",
        "factorDb",
        "factorStripe",
        "factorDocs",
        "factorBlog",
        "factorMedia",
        "factorHighlightCode",
        "factorNotify",
        "factorUi",
      ]
    `)
  })
})
