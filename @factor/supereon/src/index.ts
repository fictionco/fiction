import path from "path"
import { FactorUi } from "@factor/ui"
import {
  FactorApp,
  safeDirname,
  FactorEnv,
  ServiceConfig,
  FactorRouter,
  CliOptions,
  FactorDb,
  FactorEmail,
  FactorServer,
} from "@factor/api"
import { FactorDevRestart } from "@factor/api/plugin-env/restart"
import { CompiledServiceConfig } from "../.factor/config"
import { version } from "../package.json"
import { routes } from "./routes"
import App from "./App.vue"
import ElLogo from "./ElLogo.vue"
const cwd = safeDirname(import.meta.url, "..")
const repoRoot = safeDirname(import.meta.url, "../../..")
export const appName = "Supereon"
export const appEmail = "hello@supereon.ai"
export const liveUrl = "https://www.supereon.ai"

export const factorEnv = new FactorEnv<CompiledServiceConfig>({
  envFiles: [path.join(repoRoot, "./.env")],
  cwd,
  mainFilePath: path.join(cwd, "./src/index.ts"),
  appName,
  appEmail,
  id: "www",
  version,
})

export const factorRouter = new FactorRouter<CompiledServiceConfig>({
  routes,
  factorEnv,
})

export const factorApp = new FactorApp({
  factorEnv,
  liveUrl,
  port: +(factorEnv.var("APP_PORT") || 3000),
  rootComponent: App,
  factorRouter,
  ui: { logoLight: ElLogo, logoDark: ElLogo },
  uiPaths: [
    path.join(cwd, "./src/**/*.{vue,js,ts,html}"),
    path.join(cwd, "./src/*.{vue,js,ts,html}"),
  ],
})

export const factorDb = new FactorDb({
  connectionUrl: factorEnv.var("POSTGRES_URL"),
  factorEnv,
})

export const factorServer = new FactorServer({
  serverName: "FactorMain",
  port: +factorEnv.var("SERVER_PORT", { fallback: 3333 }),
  liveUrl: "https://server.factorjs.ai",
  isLive: factorEnv.isProd,
  factorEnv,
})

export const factorEmail = new FactorEmail({
  factorEnv,
  smtpHost: factorEnv.var("SMTP_HOST"),
  smtpPassword: factorEnv.var("SMTP_PASSWORD"),
  smtpUser: factorEnv.var("SMTP_USER"),
  appUrl: factorApp.appUrl,
})

const initializeBackingServices = async () => {
  await factorDb.init()
  factorEmail.init()
}

factorEnv.addHook({
  hook: "runCommand",
  callback: async (command: string, opts: CliOptions) => {
    if (command.startsWith("r-")) {
      const realCommand = command.split("-").pop()
      if (!realCommand) throw new Error("No command for restart")
      await new FactorDevRestart({ factorEnv }).restartInitializer({
        command: realCommand,
        config: {
          watch: [safeDirname(import.meta.url, "..")],
        },
      })
    } else {
      await initializeBackingServices()
      await factorServer.createServer()

      if (command == "dev") {
        await factorApp.serveDevApp()
      } else if (command == "build" || command == "render") {
        const { serve } = opts

        await factorApp.buildApp({ serve, render: true })
      } else if (command == "app") {
        await factorApp.serveStaticApp()
      }
    }
  },
})

export const service = {
  factorEnv,
  factorApp,
  factorRouter,
  factorUi: new FactorUi({ factorEnv, factorApp }),
}

export type ServiceContainer = typeof service

export const setup = (): ServiceConfig => {
  return { service }
}
