import { expect, it, describe } from "vitest"
import axios, { AxiosResponse } from "axios"
import { EndpointResponse } from "@factor/api/types"
import { FactorServer } from ".."

describe("server test", () => {
  it("starts endpoint server", async () => {
    const factorServer = new FactorServer({
      serverName: "testServer",
      port: 9929,
    })

    const server = await factorServer.createServer()

    expect(factorServer.port).toBe(9929)

    expect(factorServer.serverUrl).toMatchInlineSnapshot(
      '"http://localhost:9929"',
    )

    let response: AxiosResponse<EndpointResponse> | undefined
    try {
      response = await axios.get<EndpointResponse>(
        `http://localhost:${factorServer.port}/health`,
      )
    } catch (error) {
      console.error(error)
    }

    expect(response?.data).toMatchInlineSnapshot(`
      {
        "message": "ok",
        "status": "success",
      }
    `)

    expect(response?.status).toBe(200)

    expect(response?.data).toMatchInlineSnapshot(`
      {
        "message": "ok",
        "status": "success",
      }
    `)

    expect(response?.data.message).toBe("ok")

    server?.close()
  })
})
