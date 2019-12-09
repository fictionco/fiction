import { resolve, dirname, relative } from "path"
import { addFilter, applyFilters } from "@factor/tools/hooks"

import fs from "fs-extra"

const CWD = (): string => {
  return process.env.FACTOR_CWD || process.cwd()
}

const relativePath = (key: string): string => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { main = "index.js" } = require(resolve(CWD(), "package.json"))
  const sourceDirectory = dirname(resolve(CWD(), main))

  const app = "."

  const source = relative(CWD(), sourceDirectory)
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
    "config-file-public": [app, "factor-config.json"],
    "config-file-private": [app, ".env"],
    "loader-app": [...generated, "loader-app.ts"],
    "loader-server": [...generated, "loader-server.ts"],
    "loader-settings": [...generated, "loader-settings.ts"],
    "loader-styles": [...generated, "loader-styles.less"],
    "client-manifest": [...dist, "factor-client.json"],
    "server-bundle": [...dist, "factor-server.json"]
  })

  const p = paths[key]

  return Array.isArray(p) ? p.join("/") : p
}

export const getPath = (key: string): string => {
  const rel = relativePath(key)
  const full = typeof rel != "undefined" ? resolve(CWD(), rel) : ""

  return full
}

// Returns configuration array for webpack copy plugin
// if static folder is in app or theme, contents should copied to dist
const staticCopyConfig = (): CopyItemConfig[] => {
  const themeRoot = getPath("theme")
  const themePath = themeRoot ? resolve(themeRoot, "static") : ""
  const appPath = getPath("static")

  const paths = [themePath, appPath]
  const copyItems: CopyItemConfig[] = []

  paths.forEach(p => {
    if (fs.pathExistsSync(p)) copyItems.push({ from: p, to: "", ignore: [".*"] })
  })

  return copyItems
}

// Add static folder copy config to webpack copy plugin
addFilter({
  key: "paths",
  hook: "webpack-copy-files-config",
  callback: (_: CopyItemConfig[]) => [..._, ...staticCopyConfig()]
})

addFilter({
  key: "paths",
  hook: "webpack-aliases",
  callback: (_: Record<string, string>) => {
    return {
      ..._,
      __SRC__: getPath("source"),
      __CWD__: getPath("app"),
      __FALLBACK__: getPath("app")
    }
  }
})

interface CopyItemConfig {
  from: string;
  to: string;
  ignore: string[];
}
