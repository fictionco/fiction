import { applyFilters, pushToFilter } from "@factor/api/hooks"
import { toLabel } from "@factor/api/utils"
import { FactorPost } from "@factor/post/types"
import { ListItem, getPermalink } from "@factor/api"
import Vue from "vue"
import { TemplateSetting } from "@factor/templates/types"

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
  categories?: ListItem[];
  customPermalink?: true | string;
  permalink?: (p: any) => string;
  templateSettings?: TemplateSetting[];
  addSitemap?: true;
}

export const addPostType = (config: PostTypeConfig): void => {
  pushToFilter({ hook: "post-types-config", key: config.postType, item: config })
}

export const postTypesConfig = (): PostTypeConfig[] => {
  return applyFilters("post-types-config", []).map((_: PostTypeConfig) => {
    const baseRoute = typeof _.baseRoute == "undefined" ? _.postType : _.baseRoute

    const label = toLabel(_.postType)

    return {
      postType: "post",
      permalink: (post: FactorPost): string => {
        return getPermalink({
          postType: post.postType,
          permalink: post.permalink,
          root: false
        })
      },
      baseRoute,
      nameIndex: label,
      nameSingle: label,
      namePlural: label,
      ..._
    }
  })
}

export const getPostTypeConfig = (postType: string): PostTypeConfig => {
  const userConfig = postTypesConfig().find(pt => pt.postType == postType) || {
    postType: "post"
  }

  return userConfig
}
