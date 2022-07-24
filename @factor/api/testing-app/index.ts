import http from "http"
import fs from "fs"
import path from "path"
import { createServer } from "vite"
import vue from "@vitejs/plugin-vue"
import unocss from "unocss/vite"
import presetIcons from "@unocss/preset-icons"
import { presetAttributify, presetUno, presetWind } from "unocss"
import type { Browser, LaunchOptions } from "playwright"
import type { faker } from "@faker-js/faker"
import { createExpressApp, safeDirname } from "../utils"
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
  server?: http.Server
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
    this.server?.close()
  }

  async createApp(options: { head?: string } = {}) {
    let { head = "" } = options

    head = [head, this.head].join("\n")

    const vars = {
      NODE_ENV: process.env.NODE_ENV || "development",
    }

    const processDefines = Object.fromEntries(
      Object.entries(vars).map(([k, v]) => {
        return [`process.env.${k}`, JSON.stringify(v)]
      }),
    )

    const app = createExpressApp({
      // in dev these cause images/scripts to fail locally
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    })

    const viteServer = await createServer({
      configFile: false,
      root: this.root,
      mode: "production",
      server: {
        port: this.port,
        host: true,
        middlewareMode: true,
      },
      appType: "custom",

      define: processDefines,

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

    app.use(viteServer.middlewares)

    app.use("*", async (req, res, next) => {
      const url = req.originalUrl

      try {
        // 1. Read index.html
        let template = fs.readFileSync(
          path.resolve(this.root, "index.html"),
          "utf8",
        )

        // 2. Apply Vite HTML transforms. This injects the Vite HMR client, and
        //    also applies HTML transforms from Vite plugins, e.g. global preambles
        //    from @vitejs/plugin-react
        template = await viteServer.transformIndexHtml(url, template)

        // 3. Load the server entry. vite.ssrLoadModule automatically transforms
        //    your ESM source code to be usable in Node.js! There is no bundling
        //    required, and provides efficient invalidation similar to HMR.
        // const { render } = await viteServer.ssrLoadModule(
        //   "/src/entry-server.js",
        // )

        // 4. render the app HTML. This assumes entry-server.js's exported `render`
        //    function calls appropriate framework SSR APIs,
        //    e.g. ReactDOMServer.renderToString()
        const appHtml = "" //await render(url)

        // 5. Inject the app-rendered HTML into the template.
        const html = template.replace(`<!--ssr-outlet-->`, appHtml)

        // 6. Send the rendered HTML back.
        res.status(200).set({ "Content-Type": "text/html" }).end(html)
      } catch (error) {
        // If an error is caught, let Vite fix the stack trace so it maps back to
        // your actual source code.
        viteServer.ssrFixStacktrace(error as Error)
        next(error)
      }
    })

    this.server = app.listen(this.port)

    return this.server
  }
}
