import { applyFilters, pushToFilter } from "@factor/tools/filters"
import { toLabel } from "@factor/tools/utils"
import Vue from "vue"

export interface PostTypeConfig {
  baseRoute?: string;
  postType: string;
  icon?: string;
  model?: string;
  nameIndex?: string;
  nameSingle?: string;
  namePlural?: string;
  listTemplate?: () => Promise<Vue>;
  editTemplate?: () => Promise<Vue>;
  add?: boolean;
  accessLevel?: number;
  hideAdmin?: boolean;
}

export const addPostType = (config: PostTypeConfig): void => {
  pushToFilter("post-types-config", config, { key: config.postType })
}

export const postTypesConfig = (): PostTypeConfig[] => {
  return applyFilters("post-types-config", []).map((_: PostTypeConfig) => {
    const baseRoute = typeof _.baseRoute == "undefined" ? _.postType : _.baseRoute

    const label = toLabel(_.postType)

    return { baseRoute, nameIndex: label, nameSingle: label, namePlural: label, ..._ }
  })
}

export const getPostTypeConfig = (postType: string): PostTypeConfig | undefined => {
  return postTypesConfig().find(pt => pt.postType == postType)
}
