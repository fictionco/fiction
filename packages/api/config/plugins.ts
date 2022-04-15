import { dotSetting, storeItem, stored } from ".."

import { UserConfig } from "./types"

export const setUserConfig = async (
  userConfig: UserConfig,
): Promise<UserConfig> => {
  storeItem("userConfig", userConfig)

  return userConfig
}

export const getUserConfig = (): UserConfig | undefined => {
  return stored("userConfig")
}

export const userConfigSetting = <T extends keyof UserConfig>(
  key: T,
): UserConfig[T] => {
  return dotSetting({ key, settings: getUserConfig() ?? {} })
}
