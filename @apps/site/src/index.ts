import * as docsEngine from "@factor/plugin-docs-engine"
import * as blogEngine from "@factor/plugin-blog-engine"
import * as hlCode from "@factor/plugin-highlight-code"
import * as notifyPlugin from "@factor/plugin-notify"
import { UserConfig } from "@factor/api"
import { docs, groups } from "../docs/map"
import { posts } from "../blog/map"
import { routes } from "./routes"

export const setup = (): UserConfig => {
  return {
    routes,
    plugins: [
      docsEngine.setup({ docs, groups, baseRoute: "/docs" }),
      blogEngine.setup({ posts, baseRoute: "/blog" }),
      hlCode.setup(),
      notifyPlugin.setup(),
    ],
    server: () => {
      return { variables: { TEST_SERVER: "TEST" } }
    },
  }
}
