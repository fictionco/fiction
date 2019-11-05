describe("email", () => {
  describe("server", () => {
    it.todo("shows 'setup needed' if SMTP creds are missing")
    it.todo("adds setup CLI")
    it.todo("sends transactional email")
    it.todo("allows for customization/extension")
  })

  describe("browser", () => {
    it.todo("requests to send email from browser")
  })

  describe("email", () => {
    // plain text can be useful for other types of logging
    it.todo("generates html and plain text versions")
    it.todo("supports typical options (to, from, subject)")
    it.todo("has appropriate hooks/filters")
  })
})
