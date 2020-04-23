import { applyFilters, pushToFilter } from "@factor/api/hooks"
import { deepMerge } from "@factor/api/utils"

import log from "@factor/api/logger"
import {
  postTypesConfig,
  PostTypeConfig,
  PopulationContexts,
} from "@factor/api/post-types"
import { UserRoles, CurrentUserState } from "@factor/user/types"

import {
  DetermineUpdatePermissions,
  FactorSchemaModule,
  SchemaPermissions,
  FactorPost,
  PostIndexMeta,
  PostActions,
  PostStatus,
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
 * @deprecate 1.8
 */
const upgradeOldSchema = (): PostTypeConfig[] => {
  const oldDataSchemas = applyFilters("data-schemas", [])

  return oldDataSchemas.map((sm: FactorSchemaModule) => {
    const s = typeof sm == "function" ? sm() : sm

    const schemaPopulated: Record<string, PopulationContexts> = {}
    if (s.populatedFields) {
      s.populatedFields.forEach((f) => {
        let val: PopulationContexts
        if (f.context) {
          val = f.context
        } else if (f.depth) {
          if (f.depth > 20) {
            val = "single"
          } else if (f.depth >= 8) {
            val = "list"
          } else {
            val = "any"
          }
        }
        if (val) {
          schemaPopulated[f.field] = val
        }
      })
    }

    return {
      postType: s.name,
      schemaPopulated,
      schemaDefinition: s.schema ? s.schema : undefined,
      schemaOptions: s.options ? s.options : undefined,
      schemaMiddleware: s.callback ? s.callback : undefined,
    }
  })
}

/**
 * Gets all schemas for factor post types
 */
export const getAddedSchemas = (): PostTypeConfig[] => {
  const postTypes = [...upgradeOldSchema(), ...postTypesConfig()]
    .filter((_) => _.schemaDefinition)
    .filter((pt: PostTypeConfig, index: number, self: PostTypeConfig[]) => {
      // remove duplicates, favor the last
      const lastIndexOf = self.map((_) => _.postType).lastIndexOf(pt.postType)
      return index === lastIndexOf
    })

  const added = postTypes.map((s: PostTypeConfig) => {
    const { schemaDefinition, postType } = s

    const def =
      typeof schemaDefinition == "function" ? schemaDefinition() : schemaDefinition

    s.schemaDefinition = applyFilters(`schema-definition-${s.postType}`, def)

    return applyFilters(`data-schema-${postType}`, s)
  })

  return added
}
/**
 * Gets the base post schema
 */
export const getBaseSchema = (): PostTypeConfig => {
  return getAddedSchemas().find((s) => s.postType == "post") ?? { postType: "post" }
}
/**
 * Gets the factor schema associated with a post type
 * @param postType - post type
 */
export const getSchema = (postType: string): PostTypeConfig => {
  const found = getAddedSchemas().find((s) => s.postType == postType)

  return found ?? getBaseSchema()
}

const getContextDepth = (context: PopulationContexts): number => {
  let depth
  if (context == "list") {
    depth = 10
  } else if (context == "single") {
    depth = 20
  } else {
    depth = 10
  }

  return depth
}

/**
 * Gets the fields that should be populated for a given post type schema
 * @param postType - the post type for the schema
 * @param depth - Depth argument gives us ability to set how deeply populated we are looking to go
 */
export const getSchemaPopulatedFields = ({
  postType = "post",
  depth = 10,
  context,
}: {
  postType: string
  depth?: number
  context?: PopulationContexts
}): string[] => {
  let fields = getSchema("post").schemaPopulated || {}

  const schema = getSchema(postType)

  if (postType != "post" && schema) {
    const postTypePopulated = schema.schemaPopulated || {}
    fields = { ...fields, ...postTypePopulated }
  }

  depth = context ? getContextDepth(context) : depth

  const pop = Object.entries(fields)
    .filter((entry) => {
      return depth <= getContextDepth(entry[1])
    })
    .map(([key]) => key)

  return pop
}

/**
 * Gets a merged permissions config between post type and base post
 * @param postType - post type
 */
export const getSchemaPermissions = ({
  postType,
  embedded,
}: {
  postType: string
  embedded?: true
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
  post,
}: {
  user: CurrentUserState
  post: FactorPost
}): boolean => {
  if (!user) {
    return false
  }

  const userId = user._id.toString()
  const authors = post.author ? post.author.map((authorId) => authorId.toString()) : []
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
  nullKey = "",
}: {
  meta: PostIndexMeta
  field?: string
  key: string
  nullKey?: string
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
  embedded,
}: {
  bearer: CurrentUserState
  post: FactorPost
  action: PostActions
  embedded?: true
}): true | never => {
  const permissionsConfig = getSchemaPermissions({ postType: post.__t ?? "", embedded })

  const { accessLevel = 500, accessPublished = 500, accessAuthor } = permissionsConfig[
    action
  ] ?? {
    accessLevel: 500,
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
  postType,
}: DetermineUpdatePermissions): { author?: string; status?: PostStatus } => {
  const permissionsConfig = getSchemaPermissions({ postType })

  const HIGHEST_LEVEL = 500

  const {
    accessLevel = HIGHEST_LEVEL,
    accessAuthor,
    accessPublished = HIGHEST_LEVEL,
  } = permissionsConfig[action] ?? {
    accessLevel: HIGHEST_LEVEL,
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
