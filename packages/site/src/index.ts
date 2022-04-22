import { FactorDocsEngine } from "@factor/plugin-docs-engine"
import { FactorBlogEngine } from "@factor/plugin-blog-engine"
import { FactorHighlightCode } from "@factor/plugin-highlight-code"
import { FactorNotify } from "@factor/plugin-notify"
import { FactorStripe } from "@factor/plugin-stripe"
import { FactorUi } from "@factor/ui"
import { FactorDb } from "@factor/api/plugin-db"
import { FactorUser } from "@factor/api/plugin-user"
import { safeDirname, UserConfig, isTest } from "@factor/api"
import { FactorEmail } from "@factor/api/plugin-email"
import { docs, groups } from "../docs/map"
import { posts } from "../blog/map"
import { routes } from "./routes"

import { env } from "./vars"

const appMeta = {
  appName: "FactorJS",
  appEmail: "hi@factorjs.org",
  appUrl: "https://www.factorjs.org",
}

const serverUrl = env.serverUrl

const factorDb = new FactorDb({
  connectionUrl: env.postgresUrl,
  isTest: isTest(),
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
  factorDb,
  factorEmail,
  googleClientId:
    "985105007162-9ku5a8ds7t3dq7br0hr2t74mapm4eqc0.apps.googleusercontent.com",
  googleClientSecret: env.googleClientSecret,
  serverUrl,
})

export const factorStripe = new FactorStripe({
  publicKeyTest:
    "pk_test_51KJ3HNBNi5waADGv8mJnDm8UHJcTvGgRhHmKAZbpklqEANE6niiMYJUQGvinpEt4jdPM85hIsE6Bu5fFhuBx1WWW003Fyaq5cl",
  secretKeyTest: env.stripeSecretKeyTest,
  stripeMode: "test",
  hooks: [],
  products: [],
  factorUser,
  serverUrl,
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
      docsPlugin.setup(),
      blogPlugin.setup(),
      new FactorHighlightCode().setup(),
      new FactorNotify().setup(),
      factorStripe.setup(),
      new FactorUi().setup(),
      factorUser.setup(),
      factorDb.setup(),
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
