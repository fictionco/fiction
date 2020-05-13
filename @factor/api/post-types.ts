import { applyFilters, pushToFilter } from "@factor/api/hooks"
import { toLabel } from "@factor/api/utils"
import { FactorPost, SchemaPermissions } from "@factor/post/types"
import { ListItem, slugify } from "@factor/api"
import Vue from "vue"
import { TemplateSetting } from "@factor/templates/types"
import { SchemaDefinition, SchemaOptions, Schema } from "mongoose"

export type PopulationContexts = "list" | "any" | "single" | undefined

export interface PostTypeConfig {
  baseRoute?: string
  postType: string
  icon?: string
  // model?: string
  nameIndex?: string
  nameSingle?: string
  namePlural?: string
  listTemplate?: () => Promise<Vue>
  editTemplate?: () => Promise<Vue>
  noAddNew?: boolean
  addNewText?: string
  accessLevel?: number
  managePosts?: boolean // manage in dashboard
  hideAdmin?: boolean
  categories?: ListItem[]
  customPermalink?: true | string
  permalink?: (p: any) => string
  templateSettings?: TemplateSetting[]
  addSitemap?: true
  permissions?: SchemaPermissions
  schemaDefinition?: SchemaDefinition | (() => SchemaDefinition)
  schemaMiddleware?: (s: Schema) => void
  schemaPopulated?: Record<string, PopulationContexts> | string[]
  schemaOptions?: SchemaOptions
}

export const addPostType = (config: PostTypeConfig): void => {
  pushToFilter({ hook: "post-types-config", key: config.postType, item: config })
}

export const postTypesConfig = (): PostTypeConfig[] => {
  return applyFilters("post-types-config", []).map((_: Partial<PostTypeConfig>) => {
    const baseRoute = typeof _.baseRoute == "undefined" ? `/${_.postType}` : _.baseRoute

    const label = toLabel(_.postType)

    return {
      postType: "post",
      permalink: (post: FactorPost): string => {
        const permalink = post.permalink ?? slugify(post.title ?? "")

        return `${baseRoute}/${permalink}`
      },
      baseRoute,
      nameIndex: label,
      nameSingle: label,
      namePlural: label,
      ..._,
    }
  })
}

export const basePostTypeConfig = (): PostTypeConfig => {
  return postTypesConfig().find((pt) => pt.postType == "post") || { postType: "post" }
}

export const getPostTypeConfig = (postType?: string): PostTypeConfig => {
  const base = basePostTypeConfig()

  if (!postType) return base

  return postTypesConfig().find((pt) => pt.postType == postType) || base
}
