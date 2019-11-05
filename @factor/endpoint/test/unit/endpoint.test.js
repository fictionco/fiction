describe("endpoint", () => {
  describe("server", () => {
    it.todo("adds endpoint middleware from endpoint filter")
    it.todo("parses JWT bearer token into user")
    it.todo("returns JSON result and error in response")
    it.todo("elegantly handles endpoint errors on server")
    it.todo("runs endpoint methods based on module or class handler")
    it.todo("passes correct parameters")
  })

  describe("app/browser", () => {
    it.todo("allows requests from browser/app")
    it.todo("adds bearer header")
    it.todo("uses POST request")
    it.todo("elegantly handles endpoint errors in browser")
  })
})
