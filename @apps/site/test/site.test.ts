import { expect, it, describe } from "vitest"
import { execaCommandSync, execaCommand, ExecaChildProcess } from "execa"
import { chromium } from "playwright"
import { randomBetween } from "@factor/api"
const serverPort = randomBetween(1000, 9000)
const appPort = randomBetween(1000, 9000)

describe("build tests", () => {
  it("prerenders", () => {
    const r = execaCommandSync(
      `npm exec -w @factor/site -- factor prerender --port ${serverPort}`,
      {
        env: { TEST_ENV: "unit" },
        timeout: 30_000,
      },
    )

    expect(r.stdout).toContain("built successfully")
  })

  it("runs dev", () => {
    const r = execaCommandSync(
      `npm exec -w @factor/site -- factor rdev --exit --port ${serverPort} --port-app ${appPort}`,
      {
        env: { TEST_ENV: "unit" },
        timeout: 20_000,
      },
    )

    expect(r.stdout).toContain("build variables")
    expect(r.stdout).toContain(serverPort)
    expect(r.stdout).toContain(appPort)
    expect(r.stdout).toContain("serving app")
  })

  it("renders", async () => {
    let _process: ExecaChildProcess | undefined

    await new Promise<void>((resolve) => {
      _process = execaCommand(
        `npm exec -w @factor/site -- factor rdev --port ${serverPort} --port-app ${appPort}`,
        {
          env: { TEST_ENV: "unit" },
        },
      )

      _process.stdout?.on("data", (d: Buffer) => {
        const out = d.toString()

        if (out.includes("serving app")) resolve()
      })
    })

    const browser = await chromium.launch()
    const page = await browser.newPage()
    const errorLogs: string[] = []
    page.on("console", (message) => {
      if (message.type() === "error") {
        errorLogs.push(message.text())
      }
    })

    page.on("pageerror", (err) => {
      errorLogs.push(err.message)
    })
    await page.goto(`http://localhost:${appPort}`)

    const html = await page.innerHTML("body")

    await browser.close()

    if (errorLogs.length > 0) {
      console.error(errorLogs)
    }

    expect(errorLogs.length).toBe(0)
    expect(html).toBeTruthy()

    if (_process) {
      _process.cancel()
      _process.kill("SIGTERM")
    }
  }, 20_000)
})
