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
} from "@factor/api"
import { FactorDevRestart } from "@factor/api/plugin-env/restart"
import { docs, groups } from "../docs/map"
import { posts } from "../blog/map"
import { CompiledServiceConfig } from "../.factor/config"
import { envVars } from "./vars"
import routes from "./routes"
import App from "./App.vue"
const cwd = safeDirname(import.meta.url, "..")

export const factorEnv = new FactorEnv({
  envFiles: [path.join(cwd, "./.env")],
  cwd,
  envVars,
})

export const appName = "FactorJS"
export const appEmail = "hi@factorjs.org"
export const appUrl = "https://www.factorjs.org"
export const mode = factorEnv.var<"development" | "production">("mode")

export const factorDb = new FactorDb({
  connectionUrl: factorEnv.var("postgresUrl"),
})

export const factorServer = new FactorServer({
  serverName: "FactorMain",
  port: +(factorEnv.var("serverPort") || 3333),
  serverUrl: factorEnv.var("serverUrl"),
  factorEnv,
})

export const factorRouter = new FactorRouter<CompiledServiceConfig["routes"]>({
  routes,
})

export const factorApp = new FactorApp({
  appName,
  appEmail,
  appUrl,
  factorServer,
  port: +(factorEnv.var("appPort") || 3000),
  rootComponent: App,
  factorRouter,
  uiPaths: [path.join(cwd, "./src/**/*.{vue,js,ts,html}")],
  factorEnv,
})

export const factorEmail = new FactorEmail({
  factorApp,
  smtpHost: factorEnv.var("smtpHost"),
  smtpPassword: factorEnv.var("smtpPassword"),
  smtpUser: factorEnv.var("smtpUser"),
})

export const factorUser = new FactorUser({
  factorServer,
  factorDb,
  factorEmail,
  googleClientId:
    "985105007162-9ku5a8ds7t3dq7br0hr2t74mapm4eqc0.apps.googleusercontent.com",
  googleClientSecret: factorEnv.var("googleClientSecret"),
  tokenSecret: factorEnv.var("tokenSecret"),
})

export const factorStripe = new FactorStripe({
  factorApp,
  factorServer,
  factorUser,
  publicKeyTest:
    "pk_test_51KJ3HNBNi5waADGv8mJnDm8UHJcTvGgRhHmKAZbpklqEANE6niiMYJUQGvinpEt4jdPM85hIsE6Bu5fFhuBx1WWW003Fyaq5cl",
  secretKeyTest: factorEnv.var("stripeSecretKeyTest"),
  stripeMode: "test",
  hooks: [],
  products: [],
})

export const factorDocs = new FactorDocsEngine({
  docs,
  groups,
  baseRoute: "/docs",
  factorApp,
})
export const factorBlog = new FactorBlogEngine({
  posts,
  baseRoute: "/blog",
  factorApp,
})

factorEnv.addHook({
  hook: "runCommand",
  callback: async (command: string, opts: CliOptions) => {
    const { serve, prerender } = opts

    if (command == "rdev") {
      await new FactorDevRestart().restartInitializer({
        command: "dev",
        config: {
          verbose: true,
          ignore: ["**/dist/*", "**/rendered/*", "**/node_modules/**"],
          ext: "js,ts,cjs,mjs",
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
  factorApp,
  factorRouter,
  factorServer,
  factorUser,
  factorDb,
  factorStripe,
  factorDocs,
  factorBlog,
  factorHighlightCode: new FactorHighlightCode(),
  factorNotify: new FactorNotify(),
  factorUi: new FactorUi({ factorApp }),
}

export type ServiceContainer = typeof service

export const setup = (): ServiceConfig => {
  return { service }
}
