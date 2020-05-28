import { resolve, dirname, relative } from "path"
import { addFilter, applyFilters } from "@factor/api/hooks"
import { getWorkingDirectory } from "@factor/api/utils"
import fs from "fs-extra"

import { WebpackCopyItemConfig } from "@factor/build/types"

const relativePath = (key: string, cwd?: string): string => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { main = "index.js" } = require(resolve(getWorkingDirectory(cwd), "package.json"))
  const sourceDirectory = dirname(resolve(getWorkingDirectory(cwd), main))

  const app = "."

  const source = relative(getWorkingDirectory(cwd), sourceDirectory)
  const dist = [app, "dist"]
  const generated = [app, ".factor"]
  const coreApp = dirname(require.resolve("@factor/app"))

  const paths = applyFilters("paths", {
    app,
    source,
    dist,
    generated,
    coreApp,
    static: [source, "static"],
    "entry-browser": [coreApp, "entry-browser"],
    "entry-server": [coreApp, "entry-server"],
    "config-file-public": [app, "package.json"],
    "config-file-private": [app, ".env"],
    "loader-lang": [...generated, "loader-lang.ts"],
    "loader-app": [...generated, "loader-app.ts"],
    "loader-server": [...generated, "loader-server.ts"],
    "loader-settings": [...generated, "loader-settings.ts"],
    "loader-styles": [...generated, "loader-styles.less"],
    "client-manifest": [...dist, "factor-client.json"],
    "server-bundle": [...dist, "factor-server.json"],
  } as { [key: string]: string | string[] })

  const p = paths[key]

  return Array.isArray(p) ? p.join("/") : p
}

export const getPath = (key: string, cwd?: string): string => {
  const rel = relativePath(key, cwd)
  const full = typeof rel != "undefined" ? resolve(getWorkingDirectory(cwd), rel) : ""

  return full
}

/**
 * Returns configuration array for webpack copy plugin
 * if static folder is in app or theme, contents should copied to dist
 * @param cwd
 */
const staticCopyConfig = (cwd?: string): WebpackCopyItemConfig[] => {
  const paths = [getPath("static", cwd)]

  if (getPath("theme")) {
    paths.push(resolve(getPath("theme", cwd), "static"))
  }

  const copyItems: WebpackCopyItemConfig[] = []

  paths.forEach((p) => {
    if (fs.pathExistsSync(p)) copyItems.push({ from: p, to: "" })
  })

  return copyItems
}

export const setup = (): void => {
  // Add static folder copy config to webpack copy plugin
  addFilter({
    key: "paths",
    hook: "webpack-copy-files-config",
    callback: (_: WebpackCopyItemConfig[], { cwd }) => {
      return [..._, ...staticCopyConfig(cwd)]
    },
  })

  addFilter({
    key: "paths",
    hook: "webpack-aliases",
    callback: (_: Record<string, string>, { cwd }) => {
      return {
        ..._,
        __SRC__: getPath("source", cwd),
        __CWD__: getPath("app", cwd),
        __FIND__: getPath("app", cwd),
      }
    },
  })
}

setup()
