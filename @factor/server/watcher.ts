import { getFactorDirectories } from "@factor/cli/extension-loader"
import { getPath } from "@factor/tools/paths"
import chokidar from "chokidar"

export function watcher(callback) {
  const watchDirs = getFactorDirectories().map(_ => `${_}/**`)

  chokidar
    .watch([`${getPath("source")}/**`, ...watchDirs], {
      ignoreInitial: true,
      ignored: `**/node_modules/**`
    })
    .on("all", async (event, path) => {
      callback({ event, path })
    })
}
