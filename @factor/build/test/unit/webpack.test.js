describe("webpack", () => {
  describe("webpack-config", () => {
    it("returns the correct development config", () => {})
    it("returns the correct production config", () => {})
    it("returns on appropriate callbacks", () => {})
    it("loads css, less and sass", () => {})
    it("handles common static file types (jpg, md, etc..)", () => {})
    it("supports bundle analysis", () => {})
    it("defines application ENV variables", () => {})
    it("has config filters", () => {})
  })
  describe("webpack-override", () => {
    it("recognizes the override alias and uses correct override hierarchy", () => {})
    it("allows for browser/webpack overrides '-browser' (to prevent MODULE_NOT_FOUND errors)", () => {})
  })
  describe("webpack-production-build", () => {
    it("logs correct information from production build", () => {})
    it("empties and then recreates dist folder", () => {})
    it("builds dist SSR bundles", () => {})
    it("builds client chunks", () => {})
    it("moves static files", () => {})
  })

  describe("webpack-development-build", () => {
    it("logs errors correctly", () => {})
  })
})
