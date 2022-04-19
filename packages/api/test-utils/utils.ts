import path from "path"
import { createRequire } from "module"
import { expect, it, describe } from "vitest"
import { execaCommandSync, execaCommand, ExecaChildProcess } from "execa"
import { chromium, Browser, Page } from "playwright"
import { expect as expectUi, Expect } from "@playwright/test"
import fs from "fs-extra"
import { getEnvVars } from "../utils"
import { randomBetween, setCurrentUser, log } from ".."
import { getServerUserConfig, MainFile } from "../config"
import { FactorUser, FullUser } from "../plugin-user"
import { PackageJson } from "../types"
import { setupAppFromMainFile } from "../entry/setupApp"
import { FactorDb } from "../plugin-db"
import { FactorEmail } from "../plugin-email"

const require = createRequire(import.meta.url)

const getModuleName = (cwd: string): string => {
  const pkg = require(`${cwd}/package.json`) as PackageJson
  return pkg.name
}

export const getTestCwd = (): string => {
  return path.dirname(require.resolve("@factor/site/package.json"))
}

export const getTestEmail = (): string => {
  const key = Math.random().toString().slice(2, 8)
  return `arpowers+${key}@gmail.com`
}

export type TestServerConfig = {
  _process: ExecaChildProcess
  appPort: number
  serverPort: number
  serverUrl: string
  destroy: () => Promise<void>
  browser: Browser
  page: Page
  expectUi: Expect
  appUrl: string
}

export type TestUtils = {
  user: FullUser | undefined
  token: string
  email: string
  factorDb: FactorDb
  factorUser: FactorUser
  factorEmail: FactorEmail
  serverUrl: string
}

export const createTestUtils = async (): Promise<TestUtils> => {
  const serverVars = [
    "POSTGRES_URL",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
  ] as const
  const env = getEnvVars({ serverVars, isTest: true })

  const serverUrl = `http://localhost:${process.env.FACTOR_SERVER_PORT}`

  const factorEmail = new FactorEmail({
    appEmail: "arpowers@gmail.com",
    appName: "TestApp",
    isTest: true,
  })

  const factorDb = new FactorDb({ connectionUrl: process.env.POSTGRES_URL })

  const factorUser = new FactorUser({
    factorDb,
    factorEmail,
    googleClientId: env.GOOGLE_CLIENT_ID,
    googleClientSecret: env.GOOGLE_CLIENT_SECRET,
    serverUrl,
  })

  const key = Math.random().toString().slice(2, 12)
  const email = `arpowers+${key}@gmail.com`
  const r = await factorUser.queries.ManageUser.serve(
    {
      fields: { email: `arpowers+${key}@gmail.com`, emailVerified: true },
      _action: "create",
    },
    { server: true },
  )

  const user = r.data
  const token = r.token

  if (!token) throw new Error("token not returned")
  if (!user) throw new Error("no user created")

  return { user, token, email, factorUser, factorDb, factorEmail, serverUrl }
}

export const setTestCurrentUser = async (params: {
  mainFile: MainFile
  factorUser: FactorUser
}): Promise<TestUtils> => {
  const { mainFile, factorUser } = params
  await setupAppFromMainFile({ mainFile })

  const testUtils = await createTestUtils()

  setCurrentUser({ user: testUtils.user, token: testUtils.token })

  factorUser.setUserInitialized()

  return testUtils
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

  const userConfig = await getServerUserConfig({ moduleName })

  let _process: ExecaChildProcess | undefined

  const cmd = `npm exec -w ${moduleName} -- factor rdev --port ${serverPort} --port-app ${appPort}`

  log.info("createTestServer", `Creating test server for ${moduleName}`, {
    data: { serverPort, appPort, cwd: process.cwd(), cmd },
  })

  await new Promise<void>((resolve) => {
    _process = execaCommand(cmd, {
      env: { TEST_ENV: "unit" },
    })
    _process.stdout?.pipe(process.stdout)
    _process.stderr?.pipe(process.stderr)

    _process.stdout?.on("data", (d: Buffer) => {
      const out = d.toString()

      if (out.includes("[ready]")) resolve()
    })
  })

  if (!_process) throw new Error("Could not start dev server")

  const { appUrl = "", serverUrl = "" } = userConfig

  const browser = await chromium.launch({ headless, slowMo })
  const page = await browser.newPage()

  return {
    _process,
    appPort,
    serverPort,
    appUrl,
    serverUrl,
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
  moduleName?: string
  cwd?: string
}): void => {
  let { cwd = "", moduleName } = config
  const serverPort = randomBetween(1000, 9000)
  const appPort = randomBetween(1000, 9000)

  cwd = cwd || path.dirname(require.resolve(`${moduleName}/package.json`))

  moduleName = moduleName || getModuleName(cwd)

  if (!cwd) throw new Error("cwd is not defined")

  describe.skip(`build app: ${moduleName}`, () => {
    it("prerenders", () => {
      const command = `npm exec -w ${moduleName} -- factor prerender --port ${serverPort} --port-app ${appPort}`

      log.info("appBuildTests", "running prerender command", { data: command })
      const r = execaCommandSync(command, {
        env: { TEST_ENV: "unit" },
        timeout: 30_000,
      })

      expect(r.stdout).toContain("built successfully")
      fs.existsSync(path.join(cwd, "./dist/static"))
    })

    it.skip("runs dev", () => {
      const r = execaCommandSync(
        `npm exec -w ${moduleName} -- factor rdev --exit --port ${serverPort} --port-app ${appPort}`,
        {
          env: { TEST_ENV: "unit" },
          timeout: 20_000,
        },
      )

      expect(r.stdout).toContain("build variables")
      expect(r.stdout).toContain(`[ ${serverPort} ]`)
      expect(r.stdout).toContain(`[ ${appPort} ]`)
      expect(r.stdout).toContain("[ready]")
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
