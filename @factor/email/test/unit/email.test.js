describe("email", () => {
  describe("server", () => {
    it("shows 'setup needed' if SMTP creds are missing", () => {})
    it("adds setup CLI", () => {})
    it("sends transactional email", () => {})
    it("allows for customization/extension", () => {})
  })

  describe("browser", () => {
    it("requests to send email from browser", () => {})
  })

  describe("email", () => {
    // plain text can be useful for other types of logging
    it("generates html and plain text versions", () => {})
    it("supports typical options (to, from, subject)", () => {})
    it("has appropriate hooks/filters", () => {})
  })
})
