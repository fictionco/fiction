import { featuresList } from "./map"
import docsEngineServer from "@factor/plugin-docs-engine/server"
import blogEngineServer from "@factor/plugin-blog-engine/server"
import { map as blogMap } from "./blog/map"
import { docs } from "./docs/map"
import { UserConfigServer } from "@factor/types"

export const setup = (): UserConfigServer | undefined => {
  return {
    sitemaps: [
      {
        topic: "feature",
        paths: Object.keys(featuresList).map((_) => `/features/${_}`),
      },
    ],
    plugins: [
      docsEngineServer({ docs }),
      blogEngineServer({ map: blogMap, baseRoute: "/blog" }),
    ],
  }
}
