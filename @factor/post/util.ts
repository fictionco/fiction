import { applyFilters, pushToFilter } from "@factor/api/hooks"
import { deepMerge } from "@factor/api/utils"
import postSchema from "@factor/post/schema"
import log from "@factor/api/logger"
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

/**
 * Adds a new post type schema
 * @param config - post schema config
 */
export const addPostSchema = (config: FactorSchemaModule): void => {
  const key = typeof config == "function" ? config().name : config.name
  pushToFilter({ hook: "data-schemas", key, item: config })
}
/**
 * Gets all schemas for factor post types
 */
export const getAddedSchemas = (): FactorSchema[] => {
  return applyFilters("data-schemas", [postSchema()]).map((s: FactorSchemaModule) => {
    return applyFilters(`data-schema-${s.name}`, typeof s == "function" ? s() : s)
  })
}
/**
 * Gets the base post schema
 */
export const getBaseSchema = (): FactorSchema => {
  return postSchema()
}
/**
 * Gets the factor schema associated with a post type
 * @param postType - post type
 */
export const getSchema = (postType: string): FactorSchema => {
  const schemas = getAddedSchemas()

  return schemas.find(s => s.name == postType) ?? postSchema()
}

/**
 * Gets the fields that should be populated for a given post type schema
 * @param postType - the post type for the schema
 * @param depth - Depth argument gives us ability to set how deeply populated we are looking to go
 */
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

/**
 * Gets a merged permissions config between post type and base post
 * @param postType - post type
 */
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

/**
 * Is a user the author of a post
 * @param user - user object
 * @param post - post object
 */
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

/**
 * Get the count of posts with a given status (or similar)
 * Null values (e.g. status is unset) should be given the value assigned by nullKey
 * Use in table control filtering
 * @param meta - the index query meta info
 * @param field - the post field to get info for
 * @param key - the key value of the post field
 * @param nullKey - the value to assign to items with a null value
 */
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

  let count = 0

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
}): true | never => {
  const permissionsConfig = getSchemaPermissions({ postType: post.__t })

  const { accessLevel, role, author, status } = permissionsConfig[action] ?? {
    accessLevel: 300
  }

  let postAccessLevel = 0

  if (status && post.status && status[post.status]) {
    const { accessLevel: statusAccessLevel } = status[post.status] || {}
    postAccessLevel = statusAccessLevel || 0
  } else {
    postAccessLevel = accessLevel ? accessLevel : roleAccessLevel(role as UserRoles)
  }

  const userRole = (bearer?.role as UserRoles) ?? UserRoles.Anonymous

  const authorId = bearer?._id

  const userAccessLevel = bearer?.accessLevel ?? roleAccessLevel(userRole)

  const isAuthor = isPostAuthor({ user: bearer, post })

  if (userAccessLevel >= postAccessLevel) {
    return true
  } else if (author && authorId && isAuthor) {
    return true
  } else {
    log.error("permissions error", bearer, action, post)
    throw new Error(`Insufficient permissions as "${userRole}"`)
  }
}

/**
 * Returns a 'query condition' object that can be added to a mongoose query
 * The condition is based on the user's ability to edit the posts they are trying to change
 * @param bearer - the user making the query
 * @param action - the CRUD action type
 * @param postType - the post type they are changing
 */
export const canUpdatePostsCondition = ({
  bearer,
  action,
  postType = "post"
}: DetermineUpdatePermissions): { author?: string } => {
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
    throw new Error(`Insufficient permissions (${userRole})`)
  }
}
