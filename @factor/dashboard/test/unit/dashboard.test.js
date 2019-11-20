import { waitFor, getPort, renderAndGetWindow } from "@test/utils"
import { dirname } from "path"
import { createRenderServer } from "@factor/server"
import { generateBundles } from "@factor/build/webpack-config"

describe("dashboard", () => {
  beforeAll(async () => {
    process.env.FACTOR_CWD = dirname(require.resolve("./test-app/package.json"))
    process.env.PORT = await getPort()
    process.env.NODE_ENV = "production"

    await generateBundles()

    await createRenderServer()
  })

  describe("general", () => {
    it("shows dashboard on dashboard route", async () => {
      const win = await renderAndGetWindow({ route: "/dashboard" })
      await waitFor(30)

      console.log(win)
      expect(2).toBe(2)
    })
    it.todo("requires authentication to view dashboard")
    it.todo("renders")

    it.todo("only shows admin panels to admins")

    it.todo("has account editing page")
  })

  describe("navigation", () => {
    it.todo("navigates correctly")
    it.todo("shows nav grouping correctly")
    it.todo("has app logo and account shortcuts")
  })

  describe("extension", () => {
    it.todo("allows for post type extension")
    it.todo("allows for page overriding")
    it.todo("shows nav grouping correctly")
    it.todo("has app logo and account shortcuts")
    it.todo("pre-fetches correct post information for routes")
  })
})
