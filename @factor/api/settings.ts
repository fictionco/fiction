import { dotSetting, deepMerge, isNode } from "@factor/api/utils"
import { getLocale } from "@factor/api/i18n"
import { applyFilters, addCallback } from "@factor/api/hooks"
import { configSettings } from "@factor/api/config"

import coreSettings from "@factor/app/core-settings"

type SettingsObject = Record<string, any>
export type SettingsRecords = Record<string, SettingsObject>

const globalObject: any = isNode ? global : window

/**
 * Returns a unique ID for a set of settings based on app directory
 * @param cwd - working directory
 */
const settingsId = (cwd?: string): string => {
  if (cwd) {
    return cwd
  } else if (process.env.FACTOR_CWD) {
    return process.env.FACTOR_CWD
  } else if (process.cwd()) {
    return process.cwd()
  } else {
    return "base"
  }
}

/**
 * Get basic config settings that are always available
 * IMPORTANT - Note that config has different handling between server/app
 * This is why core settings and config are split
 * @param cwd - working directory
 */
export const basicSettings = (cwd?: string): SettingsObject => {
  return deepMerge([configSettings(cwd), coreSettings()])
}

/**
 * Gets globally cached settings based on working directory
 * @remarks
 * - We use the global Vue instance since this doesn't get wiped during server restart
 * @param cwd - working directory
 */
export const getSettings = (cwd?: string): SettingsObject => {
  if (!globalObject.$factorSettings) globalObject.$factorSettings = {}

  return globalObject.$factorSettings[settingsId(cwd)]
    ? globalObject.$factorSettings[settingsId(cwd)]
    : basicSettings(cwd)
}

const setSettings = (settings: Record<string, any>, cwd?: string): void => {
  if (!globalObject.$factorSettings) globalObject.$factorSettings = {}

  globalObject.$factorSettings[settingsId(cwd)] = settings
}

export const createSettings = (cwd?: string): void => {
  const basic = basicSettings(cwd)

  let settingsExports: (() => Record<string, any> | Record<string, any>)[] = []
  let langExports: Record<
    string,
    (() => Record<string, any> | Record<string, any>)[]
  > = {}

  /**
   * @remark
   * - If this is made ASYNC then there are loading order problems. Settings might load after modules that need to use them.
   * - Dynamic requires only work in the server environment, as it will NOT work in webpack.
   * - The file is not required and if it doesn't exist, ignore the error
   */
  if (cwd) {
    settingsExports = require(`${cwd}/.factor/loader-settings`).default
    langExports = require(`${cwd}/.factor/loader-lang`).default
  } else {
    settingsExports = require(`__CWD__/.factor/loader-settings`).default
    langExports = require(`__CWD__/.factor/loader-lang`).default
  }

  const langArray = []

  const locale = getLocale()
  if (langExports.en) langArray.push(...langExports.en)
  if (locale != "en" && langExports[locale]) langArray.push(...langExports[locale])

  const settingsArray = applyFilters(
    "factor-settings",
    settingsExports.map((_export) => (typeof _export == "function" ? _export() : _export))
  )

  const merged = deepMerge([basic, ...settingsArray, ...langArray])

  const settings = applyFilters("merged-factor-settings", merged, { cwd })

  setSettings(settings, cwd)
}

/**
 * Gets a settings from merged factor-settings files based on dot.notation
 * @param key - dot notated pointer to setting in merged object
 * @param cwd - working directory of the app to get settings from, useful for multi-app
 */
export const setting = <T = any>(key: string, { cwd }: { cwd?: string } = {}): T => {
  const settings = getSettings(cwd)

  return dotSetting({ key, settings })
}

const setup = (): void => {
  const key = "createSettings"
  addCallback({
    hook: "before-server-plugins",
    callback: () => createSettings(),
    key,
  })
  addCallback({
    hook: "before-app-plugins",
    callback: () => createSettings(),
    key,
  })
}

setup()
