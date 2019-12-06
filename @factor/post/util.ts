import { applyFilters, pushToFilter } from "@factor/tools/filters"

import postSchema from "@factor/post/schema"
import { deepMerge } from "@factor/tools/utils"
import { UserRoles, CurrentUserState } from "@factor/user/types"
import { roleAccessLevel } from "@factor/user/util"
import {
  DetermineUpdatePermissions,
  FactorSchema,
  FactorSchemaModule,
  SchemaPermissions,
  FactorPost,
  PostIndexMeta,
  PostActions
} from "./types"

export * from "./object-id"

export const extendPostSchema = (
  config: FactorSchemaModule,
  options: { key?: string } = {}
): void => {
  options.key = options.key ?? config.name
  pushToFilter("data-schemas", config, options)
}

export const getAddedSchemas = (): FactorSchema[] => {
  return applyFilters("data-schemas", [postSchema()]).map((s: FactorSchemaModule) => {
    return applyFilters(`data-schema-${s.name}`, typeof s == "function" ? s() : s)
  })
}

export const getBaseSchema = (): FactorSchema => {
  return postSchema()
}

export const getSchema = (postType: string): FactorSchema => {
  const schemas = getAddedSchemas()

  return schemas.find(s => s.name == postType) ?? postSchema()
}

export const getSchemaPopulatedFields = ({
  postType = "post",
  depth = 10
}: {
  postType: string;
  depth: number;
}): string[] => {
  let fields = getSchema("post").populatedFields || []

  const schema = getSchema(postType)

  if (postType != "post" && schema) {
    const postTypePopulated = schema.populatedFields || []
    fields = [...fields, ...postTypePopulated]
  }

  const pop = fields.filter(_ => _.depth <= depth).map(_ => _.field)

  return pop
}

export const getSchemaPermissions = ({
  postType
}: {
  postType: string;
}): SchemaPermissions => {
  const { permissions = {} } = getSchema("post")

  let subPermissions = {}
  if (postType !== "post") {
    const subSchema = getSchema(postType)

    if (subSchema.permissions) {
      subPermissions = subSchema.permissions
    }
  }

  return deepMerge([permissions, subPermissions])
}

export const isPostAuthor = ({
  user,
  post
}: {
  user: CurrentUserState;
  post: FactorPost;
}): boolean => {
  if (!user) {
    return false
  }

  const userId = user._id.toString()
  const authors = post.author ? post.author.map(authorId => authorId.toString()) : []
  const postId = post._id.toString()

  return (userId && authors.includes(userId)) || userId == postId ? true : false
}

// Get the count of posts with a given status (or similar)
// Null values (e.g. status is unset) should be given the value assigned by nullKey
// Use in table control filtering
export const getStatusCount = ({
  meta,
  field = "status",
  key,
  nullKey = ""
}: {
  meta: PostIndexMeta;
  field?: string;
  key: string;
  nullKey?: string;
}): number => {
  if (!meta[field]) return 0

  let count

  const result = meta[field].find((_: { _id: string }) => _._id == key)

  count = result ? result.count : 0

  if (nullKey && key == nullKey) {
    const nullsCount = meta[field].find((_: { _id: string }) => _._id == null)
    count += nullsCount ? nullsCount.count : 0
  }
  return count
}

export const postPermission = ({
  bearer,
  post,
  action
}: {
  bearer: CurrentUserState;
  post: FactorPost;
  action: PostActions;
}): boolean => {
  if (process.env.FACTOR_ENV == "test") return true

  const permissionsConfig = getSchemaPermissions({ postType: post.__t })

  const { accessLevel, role, author } = permissionsConfig[action] ?? { accessLevel: 300 }

  const postAccessLevel = accessLevel ? accessLevel : roleAccessLevel(role as UserRoles)

  const userRole = (bearer?.role as UserRoles) ?? UserRoles.Anonymous

  const userAccessLevel = bearer?.accessLevel ?? roleAccessLevel(userRole)

  const isAuthor = isPostAuthor({ user: bearer, post })

  if (userAccessLevel >= postAccessLevel) {
    return true
  } else if (author && isAuthor) {
    return true
  } else {
    throw new Error("Insufficient permissions.")
  }
}

export const canUpdatePostsCondition = ({
  bearer,
  action,
  postType = "post"
}: DetermineUpdatePermissions): { author?: string } => {
  if (process.env.FACTOR_ENV == "test") return {}

  const permissionsConfig = getSchemaPermissions({ postType })

  const { accessLevel, role, author } = permissionsConfig[action] ?? { accessLevel: 300 }

  const postAccessLevel = accessLevel ? accessLevel : roleAccessLevel(role as UserRoles)

  const userRole = (bearer?.role as UserRoles) ?? UserRoles.Anonymous

  const authorId = bearer?._id ?? false

  const userAccessLevel = bearer?.accessLevel ?? roleAccessLevel(userRole)

  if (userAccessLevel >= postAccessLevel) {
    return {}
  } else if (author && authorId) {
    return { author: authorId }
  } else {
    throw new Error("Insufficient permissions.")
  }
}
