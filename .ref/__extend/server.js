import { runCallbacks } from "@factor/tools"

export async function extendServer({ restart = false }) {
  await runCallbacks("before-server-plugins")

  // eslint-disable-next-line import/no-unresolved
  await import("~/.factor/loader-server")

  await runCallbacks("initialize-server")

  if (!restart) runCallbacks("after-first-server-extend")
}
