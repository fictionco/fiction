import "@factor/app/router"
import "@factor/app/store"
import "@factor/settings"
import { runCallbacks } from "@factor/tools"

import { importPlugins } from "./util"

export async function extendServer({ restart = false }) {
  process.env.FACTOR_TARGET = "server"

  await runCallbacks("before-server-plugins")

  const { default: plugins } = await import("~/.factor/loader-server")

  await importPlugins(plugins)

  await runCallbacks("initialize-server")

  if (!restart) runCallbacks("after-first-server-extend")
}
