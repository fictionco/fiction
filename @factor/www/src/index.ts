import path from "path"
import { FactorDocsEngine } from "@factor/plugin-docs-engine"
import { FactorBlogEngine } from "@factor/plugin-blog-engine"
import { FactorHighlightCode } from "@factor/plugin-highlight-code"
import { FactorNotify } from "@factor/plugin-notify"
import { FactorStripe } from "@factor/plugin-stripe"
import { FactorUi } from "@factor/ui"
import {
  FactorApp,
  safeDirname,
  FactorDb,
  FactorUser,
  FactorServer,
  FactorEmail,
  FactorEnv,
  ServiceConfig,
  FactorRouter,
  CliOptions,
  FactorMedia,
  vars,
  FactorTestingApp,
  randomBetween,
} from "@factor/api"
import { FactorDevRestart } from "@factor/api/plugin-env/restart"
import { FactorAws } from "@factor/api/plugin-aws"
import { docs, groups } from "../docs/map"
import { posts } from "../blog/map"
import { CompiledServiceConfig } from "../.factor/config"
import { version } from "../package.json"
import { commands, envVars } from "./vars"
import routes from "./routes"
import App from "./App.vue"
vars.register(envVars)

const cwd = safeDirname(import.meta.url, "..")
const repoRoot = safeDirname(import.meta.url, "../../..")

export const factorEnv = new FactorEnv<CompiledServiceConfig>({
  envFiles: [path.join(repoRoot, "./.env")],
  cwd,
  commands,
  appName: "FactorJS",
  appEmail: "hi@factorjs.org",
  id: "www",
  version,
})

export const factorDb = new FactorDb({
  connectionUrl: factorEnv.var("POSTGRES_URL"),
  factorEnv,
})

export const factorServer = new FactorServer({
  serverName: "FactorMain",
  port: +factorEnv.var("SERVER_PORT", { fallback: 3333 }),
  liveUrl: "https://server.factorjs.org",
  isLive: factorEnv.isProd,
  factorEnv,
})

export const factorRouter = new FactorRouter<CompiledServiceConfig>({
  routes,
  factorEnv,
})

export const factorApp = new FactorApp({
  liveUrl: "https://www.factorjs.org",
  isLive: factorEnv.isProd,
  factorServer,
  port: +factorEnv.var("WWW_PORT", { fallback: 3000 }),
  rootComponent: App,
  factorRouter,
  uiPaths: [
    path.join(cwd, "./src/**/*.{vue,js,ts,html}"),
    path.join(cwd, "./blog/**/*.vue"),
    path.join(cwd, "./docs/**/*.vue"),
  ],
  factorEnv,
})

export const factorEmail = new FactorEmail({
  factorEnv,
  smtpHost: factorEnv.var("SMTP_HOST"),
  smtpPassword: factorEnv.var("SMTP_PASSWORD"),
  smtpUser: factorEnv.var("SMTP_USER"),
  appUrl: factorApp.appUrl,
})

export const factorUser = new FactorUser({
  factorEnv,
  factorServer,
  factorDb,
  factorEmail,
  googleClientId: factorEnv.var("GOOGLE_CLIENT_ID"),
  googleClientSecret: factorEnv.var("GOOGLE_CLIENT_SECRET"),
  tokenSecret: factorEnv.var("TOKEN_SECRET"),
})

export const factorStripe = new FactorStripe({
  factorEnv,
  factorApp,
  factorServer,
  factorUser,
  publicKeyTest:
    "pk_test_51KJ3HNBNi5waADGv8mJnDm8UHJcTvGgRhHmKAZbpklqEANE6niiMYJUQGvinpEt4jdPM85hIsE6Bu5fFhuBx1WWW003Fyaq5cl",
  secretKeyTest: factorEnv.var("STRIPE_SECRET_KEY_TEST"),
  stripeMode: "test",
  hooks: [],
  products: [],
})

const factorAws = new FactorAws({
  factorEnv,
  awsAccessKey: factorEnv.var("AWS_ACCESS_KEY"),
  awsAccessKeySecret: factorEnv.var("AWS_ACCESS_KEY_SECRET"),
})

const factorMedia = new FactorMedia({
  factorEnv,
  factorDb,
  factorUser,
  factorServer,
  factorAws,
  bucket: "factor-testing",
})

const factorDocs = new FactorDocsEngine({
  factorEnv,
  docs,
  groups,
  baseRoute: "/docs",
  factorApp,
})
const factorBlog = new FactorBlogEngine({
  factorEnv,
  posts,
  baseRoute: "/blog",
  factorApp,
})

const factorTestingApp = new FactorTestingApp({
  factorEnv,
  port: +factorEnv.var("TEST_APP_PORT", {
    fallback: randomBetween(1000, 2000),
  }),
  head: "<!-- test app injected -->",
})

const initializeBackingServices = async () => {
  await factorDb.init()
  factorEmail.init()
}

factorEnv.addHook({
  hook: "runCommand",
  callback: async (command: string, opts: CliOptions) => {
    const { serve, render } = opts

    if (command.startsWith("r-")) {
      const realCommand = command.split("-").pop()
      if (!realCommand) throw new Error("No command for restart")
      await new FactorDevRestart().restartInitializer({
        command: realCommand,
        config: {
          watch: [safeDirname(import.meta.url, "../..")],
        },
      })
    } else if (command === "www") {
      await factorApp.serveStaticApp()
    } else {
      await initializeBackingServices()
      await factorServer.createServer({ factorUser })

      if (command == "dev") {
        factorUser.init()
        await factorApp.serveDevApp()
        await factorTestingApp.createApp()
      } else if (command == "build") {
        await factorApp.buildApp({ serve, render })
      } else if (command == "render") {
        await factorApp.buildApp({ serve, render: true })
      }
    }
  },
})

export const service = {
  factorEnv,
  factorApp,
  factorRouter,
  factorServer,
  factorUser,
  factorDb,
  factorStripe,
  factorDocs,
  factorBlog,
  factorMedia,
  factorHighlightCode: new FactorHighlightCode({ factorEnv }),
  factorNotify: new FactorNotify({ factorEnv }),
  factorUi: new FactorUi({ factorApp, factorEnv }),
}

export type ServiceContainer = typeof service

export const setup = (): ServiceConfig => {
  return { service }
}
