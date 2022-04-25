import { expect, it, describe } from "vitest"
import axios from "axios"
import { EndpointResponse } from "../../types"
import { FactorServer } from ".."

describe("server test", () => {
  it("starts endpoint server", async () => {
    const factorServer = new FactorServer({ port: 9929 })
    const port = process.env.PORT

    const server = await factorServer.createServer()

    const response = await axios.get<EndpointResponse>(
      `http://localhost:${port}/health`,
    )

    expect(response.status).toBe(200)

    expect(response.data).toMatchInlineSnapshot(`
      {
        "message": "ok",
        "status": "success",
      }
    `)

    expect(response.data.message).toBe("ok")

    server?.close()
  })
})
