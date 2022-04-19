import { FactorDocsEngine } from "@factor/plugin-docs-engine"
import { FactorBlogEngine } from "@factor/plugin-blog-engine"
import { FactorHighlightCode } from "@factor/plugin-highlight-code"
import { FactorNotify } from "@factor/plugin-notify"
import { FactorStripe } from "@factor/plugin-stripe"
import { FactorUi } from "@factor/ui"
import { FactorDb } from "@factor/api/plugin-db"
import { FactorUser } from "@factor/api/plugin-user"
import { safeDirname, UserConfig } from "@factor/api"
import { docs, groups } from "../docs/map"
import { posts } from "../blog/map"
import { routes } from "./routes"

const dbPlugin = new FactorDb({ connectionUrl: process.env.POSTGRES_URL })

export const userPlugin = new FactorUser({
  db: dbPlugin,
  googleClientId:
    "985105007162-9ku5a8ds7t3dq7br0hr2t74mapm4eqc0.apps.googleusercontent.com",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
})
export const docsPlugin = new FactorDocsEngine({
  docs,
  groups,
  baseRoute: "/docs",
})

export const stripePlugin = new FactorStripe({
  publicKeyTest:
    "pk_test_51KJ3HNBNi5waADGv8mJnDm8UHJcTvGgRhHmKAZbpklqEANE6niiMYJUQGvinpEt4jdPM85hIsE6Bu5fFhuBx1WWW003Fyaq5cl",
  secretKeyTest: process.env.STRIPE_SECRET_KEY_TEST,
  stripeMode: "test",
  hooks: {},
  products: [],
  userPlugin,
})

export const blogPlugin = new FactorBlogEngine({ posts, baseRoute: "/blog" })

export const setup = (): UserConfig => {
  return {
    appName: "FactorJS",
    appEmail: "hi@factorjs.org",
    appUrl: "https://www.factorjs.org",
    routes,
    plugins: [
      docsPlugin.setup(),
      blogPlugin.setup(),
      new FactorHighlightCode().setup(),
      new FactorNotify().setup(),
      stripePlugin.setup(),
      new FactorUi().setup(),
      userPlugin.setup(),
      dbPlugin.setup(),
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
