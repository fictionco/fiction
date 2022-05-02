/* server-only-file */
import path from "path"
import http from "http"
import * as mod from "module"
import fs from "fs"
import glob from "glob"
import requestIp from "request-ip"
import ipUtil from "ipaddr.js"
import bodyParser from "body-parser"
import compression from "compression"
import helmet from "helmet"
import cors from "cors"
import express from "express"
import { PackageJson } from "../types"
import { getNetworkIp } from "../utils-analytics"
import { isNode } from "./vars"

type WhichModule = {
  moduleName?: string
  cwd?: string
}

export const getRequire = () => {
  if (!isNode()) {
    throw new Error("getRequire: not a node environment")
  }

  return mod.Module.createRequire(import.meta.url)
}

const mainFileRel = (cwd: string): string => {
  const pkgPath = path.resolve(cwd, "package.json")
  const pkg = getRequire()(pkgPath) as PackageJson | undefined
  return pkg?.main ?? "index"
}

export const getMainFilePath = (
  params: WhichModule = {},
): string | undefined => {
  const { cwd, moduleName } = params
  return moduleName
    ? getRequire().resolve(moduleName)
    : cwd
    ? path.resolve(cwd, mainFileRel(cwd))
    : undefined
}

/**
 * Require a path if it exists and silence any not found errors if it doesn't
 */
export const importIfExists = async <T = unknown>(
  mod: string,
): Promise<T | undefined> => {
  if (fs.existsSync(mod)) {
    return (await import(/* vite-ignore */ mod)) as T
  } else return
}

/**
 * Require a path if it exists and silence any not found errors if it doesn't
 */
export const requireIfExists = <T = unknown>(mod: string): T | undefined => {
  let result: T | undefined = undefined
  try {
    result = getRequire()(mod) as T
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
    result = getRequire().resolve(mod)
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

export const getFaviconPath = (src: string): string => {
  let faviconPath = ""
  const paths = [`${src}/favicon*`, `${src}/**/favicon*`, `${src}/icon*`]

  paths.some((paths) => {
    const r = glob.sync(paths)

    if (r && r.length > 0) {
      faviconPath = r[0]
      return true
    } else {
      return false
    }
  })

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
