import { UserConfigServer } from "@factor/types"

import docsEngineServer from "@factor/plugin-docs-engine/server"
import blogEngineServer from "@factor/plugin-blog-engine/server"
import { docs, groups } from "../docs/map"
import { map } from "../blog/map"

export const setup = (): UserConfigServer => {
  return {
    plugins: [
      docsEngineServer({ docs, groups }),
      blogEngineServer({ map, baseRoute: "/blog" }),
    ],
  }
}
