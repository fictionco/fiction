import path from "path"
import { createRequire } from "module"
import { expect, it, describe } from "vitest"
import { execaCommandSync, execaCommand, ExecaChildProcess } from "execa"
import { chromium, Browser, Page } from "playwright"
import { expect as expectUi, Expect } from "@playwright/test"
import { randomBetween, logger, PackageJson } from "@factor/api"
import fs from "fs-extra"

const require = createRequire(import.meta.url)

const getModuleName = (cwd: string): string => {
  const pkg = require(`${cwd}/package.json`) as PackageJson
  return pkg.name
}

export const getTestEmail = (): string => {
  const key = Math.random().toString().slice(2, 8)
  return `arpowers+${key}@gmail.com`
}

export type TestServerConfig = {
  _process: ExecaChildProcess
  appPort: number
  serverPort: number
  destroy: () => Promise<void>
  browser: Browser
  page: Page
  expectUi: Expect
  appUrl: string
}

export const createTestServer = async (params: {
  cwd?: string
  moduleName?: string
  appPort?: number
  serverPort?: number
  headless?: boolean
  slowMo?: number
}): Promise<TestServerConfig> => {
  const { headless = true, slowMo } = params
  let { serverPort, appPort, moduleName } = params
  serverPort = serverPort || randomBetween(1000, 9000)
  appPort = appPort || randomBetween(1000, 9000)
  moduleName = moduleName || getModuleName(params.cwd || process.cwd())

  let _process: ExecaChildProcess | undefined

  logger.log({
    level: "info",
    context: "createTestServer",
    description: `Creating test server for ${moduleName}`,
    data: { serverPort, appPort, cwd: process.cwd() },
  })

  await new Promise<void>((resolve) => {
    const cmd = `npm exec -w ${moduleName} -- factor rdev --port ${serverPort} --port-app ${appPort}`

    _process = execaCommand(cmd, { env: { TEST_ENV: "unit" } })
    _process.stdout?.pipe(process.stdout)
    _process.stderr?.pipe(process.stderr)

    _process.stdout?.on("data", (d: Buffer) => {
      const out = d.toString()

      if (out.includes("serving app")) resolve()
    })
  })

  if (!_process) throw new Error("Could not start dev server")

  const appUrl = `http://localhost:${appPort}`

  const browser = await chromium.launch({ headless, slowMo })
  const page = await browser.newPage()

  return {
    _process,
    appPort,
    serverPort,
    appUrl,
    browser,
    page,
    expectUi,
    destroy: async () => {
      if (_process) {
        _process.cancel()
        _process.kill("SIGTERM")
      }
      await browser.close()
    },
  }
}

export const appBuildTests = (config: {
  moduleName: string
  cwd?: string
}): void => {
  const { moduleName } = config
  let { cwd = "" } = config
  const serverPort = randomBetween(1000, 9000)
  const appPort = randomBetween(1000, 9000)

  cwd = cwd || path.dirname(require.resolve(`${moduleName}/package.json`))

  if (!cwd) throw new Error("cwd is not defined")

  describe(`build app: ${moduleName}`, () => {
    it("prerenders", () => {
      const r = execaCommandSync(
        `npm exec -w ${moduleName} -- factor prerender --port ${serverPort}`,
        {
          env: { TEST_ENV: "unit" },
          timeout: 30_000,
        },
      )

      expect(r.stdout).toContain("built successfully")
      fs.existsSync(path.join(cwd, "./dist/static"))
    })

    it("runs dev", () => {
      const r = execaCommandSync(
        `npm exec -w ${moduleName} -- factor rdev --exit --port ${serverPort} --port-app ${appPort}`,
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
      const { destroy, page, appUrl } = await createTestServer({
        moduleName,
        appPort,
        serverPort,
      })

      const errorLogs: string[] = []
      page.on("console", (message) => {
        if (message.type() === "error") {
          errorLogs.push(message.text())
        }
      })

      page.on("pageerror", (err) => {
        errorLogs.push(err.message)
      })
      await page.goto(appUrl)

      const html = await page.innerHTML("body")

      if (errorLogs.length > 0) {
        console.error(errorLogs)
      }

      expect(errorLogs.length).toBe(0)
      expect(html).toBeTruthy()

      await destroy()
    }, 20_000)
  })
}
