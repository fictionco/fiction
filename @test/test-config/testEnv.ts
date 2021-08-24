import fs from "fs"
import NodeEnvironment from "jest-environment-node"
import { chromium, ChromiumBrowser } from "playwright-chromium"
import type { Config } from "@jest/types"
import { playwrightEndpointPath } from "./util"
interface ConfigContext {
  testPath: string
}

const setup = class PlaywrightEnvironment extends NodeEnvironment {
  public testPath: string
  public browser?: ChromiumBrowser
  constructor(config: Config.ProjectConfig, context: ConfigContext) {
    super(config)
    this.testPath = context.testPath
  }

  async setup(): Promise<void> {
    await super.setup()
    const wsEndpoint = fs.readFileSync(playwrightEndpointPath, "utf-8")
    if (!wsEndpoint) {
      throw new Error("wsEndpoint not found")
    }

    // skip browser setup for non-playground tests
    if (!this.testPath.includes("playground")) {
      return
    }

    const browser = (this.browser = await chromium.connect({
      wsEndpoint,
    }))
    this.global.page = await browser.newPage()
  }

  async teardown(): Promise<void> {
    if (this.browser) {
      await this.browser.close()
    }
    await super.teardown()
  }
}

export default setup
