import * as docsEngine from "@factor/plugin-docs-engine"
import * as blogEngine from "@factor/plugin-blog-engine"
import * as hlCode from "@factor/plugin-highlight-code"
import * as notifyPlugin from "@factor/plugin-notify"
import * as stripePlugin from "@factor/plugin-stripe"
import * as ui from "@factor/ui"
import * as user from "@factor/api/plugin-user"
import { safeDirname, UserConfig } from "@factor/api"
import { docs, groups } from "../docs/map"
import { posts } from "../blog/map"
import { routes } from "./routes"
export const setup = (): UserConfig => {
  return {
    appName: "FactorJS",
    appEmail: "hi@factorjs.org",
    appUrl: "https://www.factorjs.org",
    routes,
    plugins: [
      docsEngine.setup({ docs, groups, baseRoute: "/docs" }),
      blogEngine.setup({ posts, baseRoute: "/blog" }),
      hlCode.setup(),
      notifyPlugin.setup(),
      stripePlugin.setup(),
      ui.setup(),
      user.setup(),
    ],
    server: () => {
      return {
        variables: { TEST_SERVER: "TEST" },
        root: safeDirname(import.meta.url, ".."),
      }
    },
    variables: {
      FACTOR_APP_NAME: "FactorJS",
      FACTOR_APP_EMAIL: "hi@factorjs.org",
      FACTOR_APP_URL: "https://www.factorjs.org",
    },
  }
}
