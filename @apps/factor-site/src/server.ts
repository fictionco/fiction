import { UserConfigServer } from "@factor/types"

import { docs, groups } from "../docs/map"

import docsEngineServer from "@factor/plugin-docs-engine/server"

export const setup = (): UserConfigServer => {
  return {
    plugins: [docsEngineServer({ docs, groups })],
  }
}
