import { applyFilters, pushToFilter } from "@factor/api/hooks"
import { deepMerge } from "@factor/api/utils"
import postSchema from "@factor/post/schema"
import log from "@factor/api/logger"

import { UserRoles, CurrentUserState } from "@factor/user/types"

import {
  DetermineUpdatePermissions,
  FactorSchema,
  FactorSchemaModule,
  SchemaPermissions,
  FactorPost,
  PostIndexMeta,
  PostActions,
  PostStatus
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
    const fullSchema = typeof s == "function" ? s() : s

    fullSchema.schema = applyFilters(`schema-definition-${s.name}`, fullSchema.schema)

    return applyFilters(`data-schema-${s.name}`, fullSchema)
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
  postType,
  embedded
}: {
  postType: string;
  embedded?: true;
}): SchemaPermissions => {
  const { permissions = {} } = getSchema("post")

  const embeddedPermissions = permissions.embedded || {}

  let subPermissions: SchemaPermissions = {}
  if (postType !== "post") {
    const subSchema = getSchema(postType)

    if (subSchema.permissions) {
      subPermissions = subSchema.permissions
    }
  }

  const subEmbeddedPermissions = subPermissions.embedded || {}

  if (embedded) {
    return deepMerge([embeddedPermissions, subEmbeddedPermissions])
  } else {
    return deepMerge([permissions, subPermissions])
  }
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
  action,
  embedded
}: {
  bearer: CurrentUserState;
  post: FactorPost;
  action: PostActions;
  embedded?: true;
}): true | never => {
  const permissionsConfig = getSchemaPermissions({ postType: post.__t ?? "", embedded })

  const { accessLevel = 500, accessPublished = 500, accessAuthor } = permissionsConfig[
    action
  ] ?? {
    accessLevel: 500
  }

  const userRole = (bearer?.role as UserRoles) ?? UserRoles.Anonymous

  const authorId = bearer?._id

  const userAccessLevel = bearer?.accessLevel ?? 0

  const isAuthor = isPostAuthor({ user: bearer, post })

  if (userAccessLevel >= accessLevel) {
    return true
  } else if (userAccessLevel >= accessPublished && post.status == PostStatus.Published) {
    return true
  } else if (accessAuthor && authorId && isAuthor) {
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
export const manyPostsPermissionCondition = ({
  bearer,
  action,
  postType
}: DetermineUpdatePermissions): { author?: string; status?: PostStatus } => {
  const permissionsConfig = getSchemaPermissions({ postType })

  const HIGHEST_LEVEL = 500

  const {
    accessLevel = HIGHEST_LEVEL,
    accessAuthor,
    accessPublished = HIGHEST_LEVEL
  } = permissionsConfig[action] ?? {
    accessLevel: HIGHEST_LEVEL
  }

  const userRole = (bearer?.role as UserRoles) ?? UserRoles.Anonymous

  const authorId = bearer?._id ?? false

  const userAccessLevel = bearer?.accessLevel ?? 0

  if (userAccessLevel >= accessLevel) {
    return {}
  } else if (userAccessLevel >= accessPublished) {
    return { status: PostStatus.Published }
  } else if (accessAuthor && authorId) {
    return { author: authorId }
  } else {
    log.error("Many posts permissions error", bearer, action, postType)
    throw new Error(`Insufficient permissions as (${userRole})`)
  }
}
