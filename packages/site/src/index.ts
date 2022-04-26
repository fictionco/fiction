import { FactorDocsEngine } from "@factor/plugin-docs-engine"
import { FactorBlogEngine } from "@factor/plugin-blog-engine"
import { FactorHighlightCode } from "@factor/plugin-highlight-code"
import { FactorNotify } from "@factor/plugin-notify"
import { FactorStripe } from "@factor/plugin-stripe"
import { FactorUi } from "@factor/ui"
import { FactorApp } from "@factor/api/plugin-app"
import { FactorDb } from "@factor/api/plugin-db"
import { FactorUser } from "@factor/api/plugin-user"
import { FactorServer } from "@factor/api/plugin-server"
import { safeDirname, UserConfig, isTest } from "@factor/api"
import { FactorEmail } from "@factor/api/plugin-email"
import { docs, groups } from "../docs/map"
import { posts } from "../blog/map"
import { routes } from "./routes"

import { env } from "./vars"
import App from "./App.vue"
const appMeta = {
  appName: "FactorJS",
  appEmail: "hi@factorjs.org",
  appUrl: "https://www.factorjs.org",
}

const mode = env.mode as "development" | "production"

export const factorDb = new FactorDb({
  connectionUrl: env.postgresUrl,
  isTest: isTest(),
})

export const factorServer = new FactorServer({
  port: env.port ? Number.parseInt(env.port) : 3333,
  serverUrl: env.serverUrl,
})

export const factorApp = new FactorApp({
  appName: "FactorJS",
  appUrl: env.appUrl,
  factorServer,
  portApp: env.portApp ? Number.parseInt(env.portApp) : 3333,
  rootComponent: App,
  mode,
})

export const factorEmail = new FactorEmail({
  appName: appMeta.appName,
  appEmail: appMeta.appEmail,
  appUrl: appMeta.appUrl,
  smtpHost: env.smtpHost,
  smtpPassword: env.smtpPassword,
  smtpUser: env.smtpUser,
  isTest: isTest(),
})

export const factorUser = new FactorUser({
  factorServer,
  factorDb,
  factorEmail,
  googleClientId:
    "985105007162-9ku5a8ds7t3dq7br0hr2t74mapm4eqc0.apps.googleusercontent.com",
  googleClientSecret: env.googleClientSecret,
  tokenSecret: env.tokenSecret,
  mode,
})

export const factorStripe = new FactorStripe({
  factorServer,
  publicKeyTest:
    "pk_test_51KJ3HNBNi5waADGv8mJnDm8UHJcTvGgRhHmKAZbpklqEANE6niiMYJUQGvinpEt4jdPM85hIsE6Bu5fFhuBx1WWW003Fyaq5cl",
  secretKeyTest: env.stripeSecretKeyTest,
  stripeMode: "test",
  hooks: [],
  products: [],
  factorUser,
})
export const docsPlugin = new FactorDocsEngine({
  docs,
  groups,
  baseRoute: "/docs",
})
export const blogPlugin = new FactorBlogEngine({ posts, baseRoute: "/blog" })

export const setup = (): UserConfig => {
  return {
    ...appMeta,
    routes,
    plugins: [
      factorApp.setup(),
      factorServer.setup(),
      factorUser.setup(),
      factorDb.setup(),
      factorStripe.setup(),
      docsPlugin.setup(),
      blogPlugin.setup(),
      new FactorHighlightCode().setup(),
      new FactorNotify().setup(),
      new FactorUi().setup(),
    ],
    server: () => {
      return {
        variables: { TEST_SERVER: "TEST" },
        root: safeDirname(import.meta.url, ".."),
      }
    },
    variables: {},
  }
}
