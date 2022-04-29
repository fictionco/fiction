import { getMainFilePath, deepMerge, storeItem, omit } from "@factor/api/utils"
import { log } from "../plugin-log"
import { FactorPlugin } from "../plugin"
import { ServiceConfig, MainFile } from "./types"
import type { FactorEnv } from "."

type WhichModule = {
  moduleName?: string
  cwd?: string
  mainFilePath?: string
}

export const storeServiceConfig = async (
  serviceConfig: ServiceConfig,
): Promise<ServiceConfig> => {
  storeItem("serviceConfig", serviceConfig)

  return serviceConfig
}

/**
 * Generate static files, note that this uses server-only utilities
 * @server
 */
const generateFiles = async (factorEnv: FactorEnv<string>): Promise<void> => {
  const { generateStaticConfig } = await import("./generate")

  await generateStaticConfig(factorEnv)
}

export const installPlugins = async (params: {
  serviceConfig: ServiceConfig
  isApp: boolean
}): Promise<ServiceConfig> => {
  const { serviceConfig, isApp } = params
  const { service = {}, ...rest } = serviceConfig
  const config: ServiceConfig[] = [rest]
  const pluginList = Object.values(service).filter(
    (_) => typeof _ == "object" && _ instanceof FactorPlugin,
  ) as FactorPlugin[]

  if (pluginList.length > 0) {
    for (const plugin of pluginList) {
      const pluginConfig = (await plugin.setup()) || {}

      const c = omit(pluginConfig, "server", "name")

      config.push(c)

      try {
        if (!isApp && pluginConfig.server) {
          const r = await pluginConfig.server()

          if (r) config.push(r)
        }
      } catch (error: unknown) {
        const e = error as Error
        const name = pluginConfig.constructor.name ?? "unknown"
        e.message = `plugin setup error (${name}): ${e.message}`
        throw e
      }
    }
  }

  const r = deepMerge<ServiceConfig>(config, {
    mergeArrays: true,
    plainOnly: true,
  })

  r.service = service

  delete r.server

  return r
}

export const compileApplication = async (params: {
  mainFilePath?: string
  isApp: boolean
  serviceConfig?: ServiceConfig
}): Promise<{ serviceConfig: ServiceConfig; mainFile: MainFile }> => {
  let { serviceConfig } = params

  const { mainFilePath, isApp } = params

  let mainFile: MainFile | undefined = undefined

  /**
   * In the app, use aliased path so rollup/vite can analyze it
   * If not app, a dynamic path is fine, but tell vite to ignore or it will print a warning
   */
  if (isApp) {
    // @ts-ignore
    // eslint-disable-next-line import/no-unresolved
    mainFile = (await import("@MAIN_FILE_ALIAS")) as MainFile
  } else if (mainFilePath) {
    mainFile = (await import(/* @vite-ignore */ mainFilePath)) as MainFile
  }

  if (!mainFile) throw new Error("no mainFile")

  let entryConfig: ServiceConfig = {}
  if (mainFile) {
    // get universal setup
    entryConfig = mainFile?.setup
      ? await mainFile.setup(serviceConfig || {})
      : {}
  }

  const merge = [serviceConfig, entryConfig]

  if (!isApp && entryConfig.server) {
    // get server specific config from main files
    const serverConfig = await entryConfig.server()

    merge.push(serverConfig ?? {})
  }

  merge.push(params.serviceConfig ?? {})

  const merged = deepMerge<ServiceConfig>(merge, {
    mergeArrays: true,
    plainOnly: true,
  })

  delete merged.server

  serviceConfig = merged

  if (serviceConfig.service) {
    try {
      serviceConfig = await installPlugins({ serviceConfig, isApp })
    } catch (error: unknown) {
      log.error("compileApplication", "plugin install error", { error })
    }
  }

  storeItem("service", serviceConfig.service)

  console.log("STORE", serviceConfig.service)

  serviceConfig = await storeServiceConfig(serviceConfig)

  return { serviceConfig, mainFile }
}

export const getServerServiceConfig = async (
  params: WhichModule & { serviceConfig?: ServiceConfig },
): Promise<ServiceConfig> => {
  const mainFilePath = params.mainFilePath ?? getMainFilePath(params)

  const { serviceConfig, mainFile } = await compileApplication({
    mainFilePath,
    isApp: false,
    serviceConfig: params.serviceConfig,
  })

  if (mainFile.factorEnv) {
    await generateFiles(mainFile.factorEnv)
  }

  return serviceConfig
}
