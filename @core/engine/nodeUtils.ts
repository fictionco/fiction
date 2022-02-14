/* server-only-file */
import path from "path"
import http from "http"
import { createRequire } from "module"
import fs from "fs"
import glob from "glob"
import requestIp from "request-ip"
import ipUtil from "ipaddr.js"
import { getNetworkIp } from "@factor/api"
import { UserConfigServer, PackageJson } from "@factor/types"
import bodyParser from "body-parser"
import compression from "compression"
import helmet from "helmet"
import cors from "cors"
import express from "express"

const require = createRequire(import.meta.url)
export const cwd = (): string => process.env.FACTOR_CWD ?? process.cwd()
export const packagePath = (): string => path.resolve(cwd(), "package.json")

const mainFile = (): string => {
  const pkg = require(packagePath()) as PackageJson
  return pkg.main ?? "index"
}
/**
 * Get source folder for CWD or optional moduleName
 */
export const sourceFolder = (moduleName?: string): string => {
  const appPath = moduleName
    ? require.resolve(moduleName)
    : path.resolve(cwd(), mainFile())

  return path.dirname(appPath)
}

export const distFolder = (): string => path.join(cwd(), "dist")
export const distServer = (): string => path.join(distFolder(), "server")
export const distClient = (): string => path.join(distFolder(), "client")

/**
 * Require a path if it exists and silence any not found errors if it doesn't
 */
export const importIfExists = async <T = unknown>(
  mod: string,
): Promise<T | undefined> => {
  if (fs.existsSync(mod)) {
    return (await import(mod)) as T
  } else return
}

export const importServerEntry = async (params: {
  moduleName?: string
}): Promise<Promise<UserConfigServer>> => {
  const { moduleName } = params
  const serverEntry = path.join(sourceFolder(moduleName), "server.ts")
  const mod = await importIfExists<{ setup?: () => Promise<UserConfigServer> }>(
    serverEntry,
  )

  const serverConfig = mod?.setup ? await mod.setup() : {}

  return serverConfig
}

/**
 * Require a path if it exists and silence any not found errors if it doesn't
 */
export const requireIfExists = async <T = unknown>(
  mod: string,
): Promise<T | undefined> => {
  let result: T | undefined = undefined
  try {
    result = require(mod) as T
  } catch (error: any) {
    const e = error as NodeJS.ErrnoException
    if (e.code != "MODULE_NOT_FOUND") {
      throw error
    } else {
      // get module missing in error message
      // https://stackoverflow.com/a/32808869
      const m = e.message.match(/(?<=')(.*?)(?=')/g)

      if (m && !m.includes(mod)) {
        throw error
      }
    }
  }

  return result
}

export const resolveIfExists = (mod: string): string | undefined => {
  let result: string | undefined = undefined
  try {
    result = require.resolve(mod)
  } catch (error: any) {
    const e = error as NodeJS.ErrnoException
    if (e.code != "MODULE_NOT_FOUND") {
      throw error
    } else {
      // get module missing in error message
      // https://stackoverflow.com/a/32808869
      const m = e.message.match(/(?<=')(.*?)(?=')/g)

      if (m && !m.includes(mod)) {
        throw error
      }
    }
  }

  return result
}

export const resolveCwd = (p: string): string => path.resolve(cwd(), p)
export const resolveSrc = (p: string): string => path.resolve(sourceFolder(), p)
export const resolveDist = (p: string): string => path.resolve(distFolder(), p)

export const getFaviconPath = (): string => {
  let faviconPath = ""
  const paths = [
    `${sourceFolder()}/favicon*`,
    `${sourceFolder()}/**/favicon*`,
    `${sourceFolder()}/icon*`,
  ]

  paths.some((paths) => {
    const r = glob.sync(paths)

    if (r && r.length > 0) {
      faviconPath = r[0]
      return true
    } else {
      return false
    }
  })

  if (!faviconPath) {
    faviconPath = path.join(
      path.dirname(require.resolve("@factor/entry")),
      "favicon.png",
    )
  }

  return faviconPath
}

export const streamToString = async (
  stream?: NodeJS.ReadableStream,
): Promise<string> => {
  if (!stream) return ""
  const chunks: Uint8Array[] = []
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk: Uint8Array) => chunks.push(Buffer.from(chunk)))
    stream.on("error", (err: Error) => reject(err))
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")))
  })
}

/**
 * Is an IP localhost?
 */
export const isLocalhostIp = (ip: string): boolean => {
  // https://docs.microsoft.com/en-us/azure/data-explorer/kusto/query/ipv6-comparefunction
  // 192.168 or c0a8 are local network
  return ip == "127.0.0.1" ||
    ip == "::1" ||
    ip.includes("192.168") ||
    ip.includes("c0a8")
    ? true
    : false
}
/**
 * Normalize IP address to v6
 */
export const normalizeIpv6 = (rawIp: string): string => {
  let ipInstance = ipUtil.parse(rawIp)

  if (ipInstance.kind() == "ipv4") {
    ipInstance = (ipInstance as ipUtil.IPv4).toIPv4MappedAddress()
  }

  return ipInstance.toString()
}
/**
 * All IPs should be stored and handled in ipv6 format
 * https://github.com/ClickHouse/ClickHouse/issues/5462
 */
export const getRequestIpAddress = async (
  request: http.IncomingMessage,
): Promise<{ ip: string; rawIp: string }> => {
  let rawIp = requestIp.getClientIp(request) ?? undefined

  if (!rawIp) {
    return { rawIp: "", ip: "" }
  }

  if (isLocalhostIp(rawIp)) {
    rawIp = await getNetworkIp()
  }

  const ip = normalizeIpv6(rawIp)

  return { rawIp, ip }
}

export const createExpressApp = (): express.Express => {
  const app = express()

  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }))
  app.use(cors())
  app.use(bodyParser.json())
  app.use(bodyParser.text())
  app.use(compression())
  return app
}
