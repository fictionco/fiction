import Factor from "vue"
import extendApp from "@factor/extend"
import plugin from "@factor/app"
import { waitFor } from "@test/utils"

let _app
let spies
describe("app", () => {
  beforeAll(async () => {
    await extendApp().extend()
    spies = {
      routes: jest.spyOn(Factor.$filters, "add"),
      components: jest.spyOn(Factor.$filters, "add")
    }
    _app = plugin(Factor)
  })
  beforeEach(() => {})
  it("has initialization system", async () => {
    setTimeout(() => {
      Factor.$events.$emit("app-mounted")
    }, 40)

    const _p = _app.client()

    expect(_p instanceof Promise).toBe(true)
    await waitFor(60)
    expect(await _p).toBe(true)
  })

  it("adds global routes and components", async () => {
    expect(spies.routes).toHaveBeenCalledWith("routes", expect.anything())
    expect(spies.components).toHaveBeenCalledWith("components", expect.anything())

    const routes = Factor.$filters.apply("routes", [])
    const components = Factor.$filters.apply("components", [])

    expect(routes).toContainObject({ path: "/" })
    expect(routes).toContainObject({ path: "*" })
    expect(components).toHaveProperty("error-404")
  })
})
