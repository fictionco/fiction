import { SiteMapConfig } from "@factor/types"
import { serverConfigSetting } from "@factor/server/config"

export const getSitemaps = (): SiteMapConfig[] => {
  const initial = serverConfigSetting("sitemaps") || []
  return initial
}
