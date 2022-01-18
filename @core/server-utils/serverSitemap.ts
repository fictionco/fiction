import { SiteMapConfig } from "@factor/types"
import { serverConfigSetting } from "@factor/server"

export const getSitemaps = (): SiteMapConfig[] => {
  const initial = serverConfigSetting<SiteMapConfig[]>("sitemaps") || []
  return initial
}
