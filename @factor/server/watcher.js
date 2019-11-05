import { getFactorDirectories } from "@factor/cli/extension-loader"
import { runCallbacks, getPath } from "@factor/tools"
import chokidar from "chokidar"

export function watcher(callback) {
  const watchDirs = getFactorDirectories().map(_ => `${_}/**`)

  chokidar
    .watch([`${getPath("source")}/**`, ...watchDirs], {
      ignoreInitial: true,
      ignored: `**/node_modules/**`
    })
    .on("all", async (event, path) => {
      await runCallbacks("restart-server")

      callback({ event, path })
    })
}
