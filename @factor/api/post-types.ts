import { applyFilters, pushToFilter } from "@factor/api/hooks"
import { toLabel } from "@factor/api/utils"
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
  noAddNew?: boolean;
  addNewText?: string;
  accessLevel?: number;
  hideAdmin?: boolean;
}

export const addPostType = (config: PostTypeConfig): void => {
  pushToFilter({ hook: "post-types-config", key: config.postType, item: config })
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
