import { expect, it, describe } from "vitest"
import axios from "axios"
import { EndpointResponse } from "../../types"
import { setupEnvironment } from ".."

describe("server test", () => {
  it("starts endpoint server", async () => {
    const port = process.env.PORT

    await setupEnvironment({ port })

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
  })
})
