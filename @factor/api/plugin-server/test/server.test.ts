import { expect, it, describe } from "@factor/api/testUtils"
import { axios } from "@factor/api/utils"
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

    let response: axios.AxiosResponse<EndpointResponse> | undefined
    try {
      response = await axios.default.get<EndpointResponse>(
        `http://localhost:${factorServer.port}/health`,
      )
    } catch (error) {
      console.error(error)
    }

    expect(response?.data.status).toBe("success")
    expect(response?.data.message).toBe("ok")
    expect(response?.status).toBe(200)

    expect(Object.keys(response?.data || {})).toMatchInlineSnapshot(`
      [
        "status",
        "message",
        "version",
        "uptime",
        "timestamp",
      ]
    `)

    server?.close()
  })
})
