import docsEngine from "@factor/plugin-docs-engine"
import { UserConfigApp } from "@factor/api"
import { docs, groups } from "../docs/map"
import { routes } from "./routes"

export const setup = (): UserConfigApp => {
  return {
    routes,
    plugins: [docsEngine({ docs, groups, baseRoute: "/docs" })],
  }
}
