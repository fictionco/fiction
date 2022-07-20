import { getMainFilePath, deepMerge, vue } from "../utils"
import { log } from "../plugin-log"
import { FactorPlugin } from "../plugin"
import { ServiceConfig, MainFile } from "./types"
type WhichModule = {
  moduleName?: string
  cwd?: string
  mainFilePath?: string
}

export const runServicesSetup = async (
  serviceConfig: ServiceConfig,
): Promise<ServiceConfig> => {
  const { service = {}, ...rest } = serviceConfig
  const config: ServiceConfig[] = [rest]
  const pluginList = Object.values(service).filter(
    (_) =>
      typeof _ == "object" &&
      !Array.isArray(_) &&
      !vue.isRef(_) &&
      typeof _.setup != "undefined",
  ) as FactorPlugin[]

  if (pluginList.length > 0) {
    for (const plugin of pluginList) {
      try {
        const pluginConfig = (await plugin.setup()) || {}

        config.push(pluginConfig)
      } catch (error: unknown) {
        const e = error as Error
        const name = plugin.constructor.name ?? "unknown"
        e.message = `plugin setup error (${name}): ${e.message}`
        throw e
      }
    }
    for (const plugin of pluginList) {
      try {
        await plugin.afterSetup()
      } catch (error: unknown) {
        const e = error as Error
        const name = plugin.constructor.name ?? "unknown"
        e.message = `plugin after setup error (${name}): ${e.message}`
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
}): Promise<{
  serviceConfig: ServiceConfig
  mainFile: MainFile
  mainFilePath?: string
}> => {
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

  merge.push(params.serviceConfig ?? {})

  const merged = deepMerge<ServiceConfig>(merge, {
    mergeArrays: true,
    plainOnly: true,
  })

  delete merged.server

  serviceConfig = merged

  if (serviceConfig.service) {
    try {
      serviceConfig = await runServicesSetup(serviceConfig)
    } catch (error: unknown) {
      log.error("compileApplication", "plugin install error", { error })
    }
  }

  return { serviceConfig, mainFile, mainFilePath }
}
/**
 * Compiles the application in the server environment
 * Generates development schemas
 */
export const getServerServiceConfig = async (
  params: WhichModule & { serviceConfig?: ServiceConfig },
): Promise<ServiceConfig> => {
  const mainFilePath = params.mainFilePath ?? getMainFilePath(params)

  const { serviceConfig } = await compileApplication({
    mainFilePath,
    isApp: false,
    serviceConfig: params.serviceConfig,
  })

  return serviceConfig
}
