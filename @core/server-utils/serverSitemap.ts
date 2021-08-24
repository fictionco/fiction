import { addFilter, applyFilters } from "@factor/api"
import { SiteMapConfig } from "@factor/types"
import { serverConfigSetting } from "@factor/server"
export const addSitemap = ({ paths, topic }: SiteMapConfig): void => {
  addFilter({
    key: topic,
    hook: "sitemaps",
    callback: (_) => {
      return [..._, { topic, paths }]
    },
  })
}

export const getSitemaps = (): SiteMapConfig[] => {
  const initial = serverConfigSetting<SiteMapConfig[]>("sitemaps") || []
  return applyFilters("sitemaps", initial)
}
