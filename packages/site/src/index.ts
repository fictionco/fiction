import path from "path"
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
import { isTest, safeDirname } from "@factor/api"
import { FactorEmail } from "@factor/api/plugin-email"
import { FactorEnv, UserConfig } from "@factor/api/plugin-env"
import { docs, groups } from "../docs/map"
import { posts } from "../blog/map"
import { routes } from "./routes"
import { envVars } from "./vars"

const cwd = safeDirname(import.meta.url, "..")

export const factorEnv = new FactorEnv({
  envFiles: [path.join(cwd, "./.env")],
  cwd,
  envVars,
})

const appName = "FactorJS"
const appEmail = "hi@factorjs.org"
const appUrl = "https://www.factorjs.org"
const mode = factorEnv.var<"development" | "production">("mode")

export const factorDb = new FactorDb({
  connectionUrl: factorEnv.var("postgresUrl"),
  isTest: isTest(),
})

export const factorServer = new FactorServer({
  port: +(factorEnv.var("serverPort") || 3333),
  serverUrl: factorEnv.var("serverUrl"),
  factorEnv,
})

export const factorApp = new FactorApp({
  appName,
  appUrl,
  factorServer,
  port: +(factorEnv.var("appPort") || 3000),
  rootComponent: path.join(cwd, "./src/App.vue"),
  mode,
  routes,
  uiPaths: [path.join(cwd, "./src/**/*.{vue,js,ts,html}")],
  factorEnv,
})

export const factorEmail = new FactorEmail({
  appName,
  appEmail,
  appUrl,
  smtpHost: factorEnv.var("smtpHost"),
  smtpPassword: factorEnv.var("smtpPassword"),
  smtpUser: factorEnv.var("smtpUser"),
  isTest: isTest(),
})

export const factorUser = new FactorUser({
  factorServer,
  factorDb,
  factorEmail,
  googleClientId:
    "985105007162-9ku5a8ds7t3dq7br0hr2t74mapm4eqc0.apps.googleusercontent.com",
  googleClientSecret: factorEnv.var("googleClientSecret"),
  tokenSecret: factorEnv.var("tokenSecret"),
  mode,
})

export const factorStripe = new FactorStripe({
  factorServer,
  publicKeyTest:
    "pk_test_51KJ3HNBNi5waADGv8mJnDm8UHJcTvGgRhHmKAZbpklqEANE6niiMYJUQGvinpEt4jdPM85hIsE6Bu5fFhuBx1WWW003Fyaq5cl",
  secretKeyTest: factorEnv.var("stripeSecretKeyTest"),
  stripeMode: "test",
  hooks: [],
  products: [],
  factorUser,
})
export const docsPlugin = new FactorDocsEngine({
  docs,
  groups,
  baseRoute: "/docs",
  factorApp,
})
export const blogPlugin = new FactorBlogEngine({
  posts,
  baseRoute: "/blog",
  factorApp,
})

export const setup = (): UserConfig => {
  return {
    plugins: [
      factorApp,
      factorServer,
      factorUser,
      factorDb,
      factorStripe,
      docsPlugin,
      blogPlugin,
      new FactorHighlightCode(),
      new FactorNotify(),
      new FactorUi({ factorApp }),
    ],
  }
}
