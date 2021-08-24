import fs from "fs-extra"
import path from "path"
import { chromium, BrowserServer } from "playwright-chromium"
import { playwrightEndpointPath, temporaryDirectory } from "./util"
declare global {
  namespace NodeJS {
    interface Global {
      __BROWSER_SERVER__?: BrowserServer
    }
  }
}

const setup = async (): Promise<void> => {
  const browserServer = await chromium.launchServer({
    headless: !process.env.VITE_DEBUG_SERVE,
    args: process.env.CI
      ? ["--no-sandbox", "--disable-setuid-sandbox"]
      : undefined,
  })

  global.__BROWSER_SERVER__ = browserServer

  await fs.mkdirp(temporaryDirectory)
  // write the endpoint url to temp folder
  // e.g. ws://127.0.0.1:[random port]/[random hash]
  await fs.writeFile(playwrightEndpointPath, browserServer.wsEndpoint())

  await fs.remove(path.resolve(__dirname, "../temp"))
}

export default setup
