import { expect, it, describe } from "vitest"
import { execaCommandSync, execaCommand, ExecaChildProcess } from "execa"
import { chromium } from "playwright"

describe("build tests", () => {
  it("prerenders", () => {
    const r = execaCommandSync(
      "npm exec -w @factor/site -- factor prerender --port 3434",
      {
        env: { TEST_ENV: "unit" },
        timeout: 30_000,
      },
    )

    expect(r.stdout).toContain("built successfully")
  })

  it("runs dev", () => {
    const r = execaCommandSync(
      "npm exec -w @factor/site -- factor rdev --exit --port 1234 --port-app 2345",
      {
        env: { TEST_ENV: "unit" },
        timeout: 20_000,
      },
    )

    expect(r.stdout).toContain("build variables")
    expect(r.stdout).toContain("1234")
    expect(r.stdout).toContain("2345")
    expect(r.stdout).toContain("serving app")
  })

  it("renders", async () => {
    let _process: ExecaChildProcess | undefined

    await new Promise<void>((resolve) => {
      _process = execaCommand(
        "npm exec -w @factor/site -- factor rdev --port 1234 --port-app 2345",
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
    await page.goto("http://localhost:2345")

    await browser.close()

    expect(errorLogs.length).toBe(0)

    if (_process) {
      _process.cancel()
      _process.kill("SIGTERM")
    }
  })
})
