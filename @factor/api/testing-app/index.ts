import { createServer, ViteDevServer } from "vite"
import vue from "@vitejs/plugin-vue"
import unocss from "unocss/vite"
import presetIcons from "@unocss/preset-icons"
import { presetAttributify, presetUno, presetWind } from "unocss"
import type { Browser, LaunchOptions } from "playwright"
import type { faker } from "@faker-js/faker"
import { safeDirname } from "../utils"
import { FactorPlugin } from "../plugin"

type TestingConfig = {
  headless?: boolean
  uiSpeed?: number
  devtools?: false
  playwrightSettings?: LaunchOptions
  random?: boolean
}
type FactorTestingAppSettings = {
  port: number
  head?: string
} & TestingConfig
export class FactorTestingApp extends FactorPlugin<FactorTestingAppSettings> {
  port = this.settings.port
  url = `http://localhost:${this.port}`
  head = this.settings.head || ""
  root = safeDirname(import.meta.url)
  server?: ViteDevServer
  browser!: Browser
  faker!: typeof faker
  initialized: Promise<void> = Promise.resolve()
  visitorId: number = 0
  headless = this.settings.headless ?? true
  uiSpeed = this.settings.uiSpeed ?? 1000
  playwrightSettings = this.settings.playwrightSettings || {}
  viewportSizes = [
    { width: 1920, height: 1080 },
    { width: 1366, height: 768 },
    { width: 1440, height: 900 },
    { width: 414, height: 896 },
    { width: 480, height: 853 },
    { width: 700, height: 1200 },
  ]
  constructor(settings: FactorTestingAppSettings) {
    super(settings)
  }
  setup() {}

  async initialize(settings: TestingConfig) {
    const playwright = await import("playwright")
    const { faker } = await import("@faker-js/faker")
    this.faker = faker

    const launchSettings = {
      headless: this.headless,
      slowMo: this.uiSpeed,
      devtools: false,
      ...this.playwrightSettings,
      ...settings,
    }
    this.log.info("creating playwright with settings", { data: launchSettings })
    this.browser = await playwright.chromium.launch(launchSettings)
  }

  async newContext(opts: TestingConfig = {}) {
    if (!this.server) throw new Error("no testing app server created")

    await this.initialize(opts)

    const { random = true } = opts

    const userAgent = this.faker.internet.userAgent()
    const rand = Math.floor(Math.random() * this.viewportSizes.length)
    const viewport = this.viewportSizes[rand]
    const locale = this.faker.random.locale()

    const contextSettings = random
      ? {
          userAgent,
          viewport,
          locale,
        }
      : {}

    const context = await this.browser.newContext(contextSettings)

    return {
      context,
      url: this.url,
      userAgent,
      viewport,
      locale,
    }
  }

  async close() {
    await this.server?.close()
  }
  async createApp(options: { head?: string } = {}) {
    let { head = "" } = options

    head = [head, this.head].join("\n")

    this.server = await createServer({
      configFile: false,
      root: this.root,
      server: {
        port: this.port,
        host: true,
      },

      define: {
        "process.env.NODE_ENV": JSON.stringify(
          process.env.NODE_ENV || "development",
        ),
      },

      plugins: [
        {
          name: "html-transform",
          transformIndexHtml(html: string) {
            return html.replace(/<\/head>/i, `${head}</head>`)
          },
        },
        vue(),
        unocss({
          presets: [
            presetIcons(),
            presetUno(),
            presetWind(),
            presetAttributify(),
          ],
        }),
      ],
    })

    await this.server.listen()

    return this.server
  }
}
