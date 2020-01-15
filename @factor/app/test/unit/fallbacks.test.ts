import { setting, createSettings } from "@factor/api/settings"
import { resolveFilePath } from "@factor/api/resolver"
describe("fallbacks", () => {
  beforeAll(() => {
    createSettings()
  })

  it("provides a 404 component fallback", () => {
    const s = setting("app.components.error404")

    expect(s).toEqual(expect.any(Function))
  })

  it("provides an HTML template fallback", () => {
    const s = setting("app.templatePath")

    const templatePath = resolveFilePath(s)

    expect(templatePath).toEqual(expect.any(String))
  })

  it("provides site wrapper", () => {
    const s = setting("app.components.site")

    expect(s).toEqual(expect.any(Function))
  })

  it("provides content wrapper", () => {
    const s = setting("app.components.content")

    expect(s).toEqual(expect.any(Function))
  })
})
