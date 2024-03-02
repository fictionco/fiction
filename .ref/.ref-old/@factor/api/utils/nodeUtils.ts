/* server-only-file */
import path from "path"
import * as mod from "module"
import fs from "fs"
import { PackageJson } from "../types"
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
    const i = import(/* @vite-ignore */ mod)
    const v = (await i) as T
    return v
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
