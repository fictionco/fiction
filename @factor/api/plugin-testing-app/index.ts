import http from "http"
import fs from "fs"
import path from "path"
import { createServer, ViteDevServer } from "vite"
import type { Browser, LaunchOptions } from "playwright"
import type { faker } from "@faker-js/faker"
import { createExpressApp, safeDirname, vue } from "../utils"
import { FactorPlugin } from "../plugin"
import sharedConfig from "./vite.config"

type TestingConfig = {
  headless?: boolean
  uiSpeed?: number
  devtools?: false
  playwrightSettings?: LaunchOptions
  random?: boolean
  mode?: "development" | "production"
  isLive?: vue.Ref<boolean>
  liveUrl?: string
}
type FactorTestingAppSettings = {
  port: number
  head?: string
} & TestingConfig
export class FactorTestingApp extends FactorPlugin<FactorTestingAppSettings> {
  port = this.settings.port
  liveUrl = this.settings.liveUrl
  url = this.utils.vue.computed(() => {
    const isLive = this.settings.isLive?.value || false
    return isLive && this.liveUrl
      ? this.liveUrl
      : `http://localhost:${this.port}`
  })
  head = this.settings.head || ""
  root = safeDirname(import.meta.url)
  server?: http.Server
  browser?: Browser
  faker?: typeof faker
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
  mode = this.settings.mode ?? this.utils.mode()
  isLive = this.settings.isLive ?? false
  constructor(settings: FactorTestingAppSettings) {
    super(settings)
  }
  setup() {}

  async initialize(settings: TestingConfig) {
    if (this.browser && this.faker) {
      return {
        faker: this.faker,
        browser: this.browser,
      }
    }

    const playwright = await import("playwright")
    const { faker } = await import("@faker-js/faker")

    const launchSettings = {
      headless: this.headless,
      slowMo: this.uiSpeed,
      devtools: false,
      ...this.playwrightSettings,
      ...settings,
    }

    this.log.info("creating playwright with settings", { data: launchSettings })
    const browser = await playwright.chromium.launch(launchSettings)

    return { faker, browser }
  }

  async newContext(opts: TestingConfig = {}) {
    if (!this.server) throw new Error("no testing app server created")

    const { faker, browser } = await this.initialize(opts)

    const { random = true } = opts

    const userAgent = faker.internet.userAgent()
    const rand = Math.floor(Math.random() * this.viewportSizes.length)
    const viewport = this.viewportSizes[rand]
    const locale = faker.random.locale()

    const contextSettings = random
      ? {
          userAgent,
          viewport,
          locale,
        }
      : {}

    const context = await browser.newContext(contextSettings)

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
    if (this.utils.isApp()) return

    let { head = "" } = options

    head = [head, this.head].join("\n")

    const app = createExpressApp({
      // in dev these cause images/scripts to fail locally
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    })

    // const server = http.createServer(app)
    this.log.info(`test app on ${this.port} in ${this.mode}`)

    const indexProd =
      this.mode == "production"
        ? fs.readFileSync(
            path.join(this.root, "dist/client/index.html"),
            "utf8",
          )
        : ""

    let manifest: Record<string, string[]> = {}
    if (this.mode == "production") {
      const imp = (await import(
        /* @vite-ignore */ path.join(this.root, "dist/client/manifest.json")
      )) as { default: Record<string, string[]> }
      manifest = imp.default
    }

    let viteServer: ViteDevServer | undefined
    if (this.mode !== "production") {
      viteServer = await createServer({
        root: this.root,
        mode: this.mode,
        server: {
          middlewareMode: true,
          hmr: {
            port: this.utils.randomBetween(10_000, 30_000),
          },
        },
        appType: "custom",
        ...sharedConfig({ buildName: "ssr" }),
      })
      app.use(viteServer.middlewares)
    } else {
      const { default: serveStatic } = await import("serve-static")
      const clientDir = path.join(this.root, "dist/client")
      app.use(serveStatic(clientDir, { index: false }))
    }

    app.use("*", async (req, res, next) => {
      const url = req.originalUrl

      try {
        let template = ""
        let render
        if (this.mode !== "production") {
          template = fs.readFileSync(
            path.resolve(this.root, "index.html"),
            "utf8",
          )

          const transformed = await viteServer?.transformIndexHtml(
            url,
            template,
          )

          template = transformed || ""
          const serverEntry = (await viteServer?.ssrLoadModule(
            "/src/server-entry.ts",
          )) as typeof import("./src/server-entry")
          render = serverEntry.render
        } else {
          template = indexProd
          // @ts-ignore // error because /dist folder is ignored
          const builtServerEntry = await import("./dist/server/server-entry")
          const buildServerEntry =
            builtServerEntry as typeof import("./src/server-entry")

          render = buildServerEntry.render
        }

        const [appHtml, preloadLinks] = await render(url, manifest)

        const html = template
          .replace(`<!--preload-links-->`, preloadLinks)
          .replace(`<!--app-html-->`, appHtml)
          .replace(/<\/head>/i, `${head}\n</head>`)

        res.status(200).set({ "Content-Type": "text/html" }).end(html)
      } catch (error) {
        // If an error is caught, let Vite fix the stack trace so it maps back to
        // your actual source code.
        viteServer?.ssrFixStacktrace(error as Error)
        next(error)
      }
    })

    this.server = app.listen(this.port)

    return this.server
  }
}
