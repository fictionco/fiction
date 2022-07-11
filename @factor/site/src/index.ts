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
} from "@factor/api"
import { FactorDevRestart } from "@factor/api/plugin-env/restart"
import { FactorAws } from "@factor/api/plugin-aws"
import { docs, groups } from "../docs/map"
import { posts } from "../blog/map"
import { CompiledServiceConfig } from "../.factor/config"
import { commands } from "./commands"
import routes from "./routes"
import App from "./App.vue"

const cwd = safeDirname(import.meta.url, "..")

export const appName = "FactorJS"
export const appEmail = "hi@factorjs.org"
export const productionUrl = "https://www.factorjs.org"

export const factorEnv = new FactorEnv<CompiledServiceConfig>({
  envFiles: [path.join(cwd, "./.env")],
  cwd,
  commands,
  appName,
  appEmail,
  productionUrl,
})

export const factorDb = new FactorDb({
  connectionUrl: factorEnv.var("POSTGRES_URL"),
})

export const factorServer = new FactorServer({
  serverName: "FactorMain",
  port: +(factorEnv.var("SERVER_PORT") || 3333),
  serverUrl: factorEnv.var("SERVER_URL"),
  factorEnv,
})

export const factorRouter = new FactorRouter<CompiledServiceConfig>({
  routes,
})

export const factorApp = new FactorApp({
  productionUrl,
  factorServer,
  port: +(factorEnv.var("APP_PORT") || 3000),
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
  factorServer,
  factorDb,
  factorEmail,
  googleClientId: factorEnv.var("GOOGLE_CLIENT_ID"),
  googleClientSecret: factorEnv.var("GOOGLE_CLIENT_SECRET"),
  tokenSecret: factorEnv.var("TOKEN_SECRET"),
})

export const factorStripe = new FactorStripe({
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
  awsAccessKey: factorEnv.var("AWS_ACCESS_KEY"),
  awsAccessKeySecret: factorEnv.var("AWS_ACCESS_KEY_SECRET"),
})

const factorMedia = new FactorMedia({
  factorDb,
  factorUser,
  factorServer,
  factorAws,
  bucket: "factor-testing",
})

const factorDocs = new FactorDocsEngine({
  docs,
  groups,
  baseRoute: "/docs",
  factorApp,
})
const factorBlog = new FactorBlogEngine({
  posts,
  baseRoute: "/blog",
  factorApp,
})

factorEnv.addHook({
  hook: "runCommand",
  callback: async (command: string, opts: CliOptions) => {
    const { serve, prerender } = opts

    if (command.startsWith("r-")) {
      const realCommand = command.split("-").pop()
      if (!realCommand) throw new Error("No command for restart")
      await new FactorDevRestart().restartInitializer({
        command: realCommand,
        config: {
          watch: [safeDirname(import.meta.url, "../..")],
        },
      })
    } else {
      await factorServer.createServer({ factorUser })

      if (command == "dev") {
        await factorApp.serveApp()
      } else if (command == "build") {
        await factorApp.buildApp({ serve, prerender })
      } else if (command == "prerender") {
        await factorApp.buildApp({ serve, prerender })
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
  factorHighlightCode: new FactorHighlightCode(),
  factorNotify: new FactorNotify(),
  factorUi: new FactorUi({ factorApp }),
}

export type ServiceContainer = typeof service

export const setup = (): ServiceConfig => {
  return { service }
}
