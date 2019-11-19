import { createServer } from "@factor/server"

describe("server", () => {
  beforeAll(() => {})

  it("creates a production server", () => {
    process.env.PORT = 7777
    process.env.NODE_ENV = "production"

    createServer()
  })
  it.todo("sets correct headers")
  it.todo("listens on the correct port")
  it.todo("starts development server")
  it.todo("starts production server")
  it.todo("adds extended middleware")
  it.todo("adds compression middleware")
  it.todo("adds logging middleware")
  it.todo("serves static assets")
  it.todo("handles errors")
})
