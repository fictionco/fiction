import docsEngine from "@factor/plugin-docs-engine"
import blogEngine from "@factor/plugin-blog-engine"
import { UserConfigApp } from "@factor/api"
import { docs, groups } from "../docs/map"
import { map } from "../blog/map"
import { routes } from "./routes"

export const setup = (): UserConfigApp => {
  return {
    routes,
    plugins: [
      docsEngine({ docs, groups, baseRoute: "/docs" }),
      blogEngine({ map, baseRoute: "/blog" }),
    ],
  }
}
