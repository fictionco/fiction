import { applyFilters, pushToFilter } from "@factor/tools/filters"
export * from "./object-id"
import postSchema from "@factor/post/schema"

export function extendPostSchema(config): void {
  pushToFilter("data-schemas", config)
}

export function getAddedSchemas() {
  return applyFilters("data-schemas", [postSchema()]).map((s) => {
    return applyFilters(`data-schema-${s.name}`, typeof s == "function" ? s() : s)
  })
}
export function getSchema(postType) {
  const schemas = getAddedSchemas()

  return schemas.find((s) => s.name == postType)
}

export function getSchemaPopulatedFields({ postType = "post", depth = 10 }) {
  let fields = getSchema("post").populatedFields || []

  const schema = getSchema(postType)

  if (postType != "post" && schema) {
    const postTypePopulated = schema.populatedFields || []
    fields = [...fields, ...postTypePopulated]
  }

  const pop = fields.filter((_) => _.depth <= depth).map((_) => _.field)

  return pop
}

export function canUpdatePost({ bearer, post, action, isNew = false }) {
  if (process.env.FACTOR_ENV == "test") return true

  const schema = getSchema(post.__t)

  if (isNew && action == "save" && schema.anonymousUserCanCreate) {
    return true
  } else if (
    bearer &&
    (bearer.accessLevel >= 300 ||
      (post.author && post.author.includes(bearer._id)) ||
      bearer._id.toString() == post._id.toString())
  ) {
    return true
  } else {
    throw new Error("Insufficient permissions.")
  }
}

// Get the count of posts with a given status (or similar)
// Null values (e.g. status is unset) should be given the value assigned by nullKey
// Use in table control filtering
export function getStatusCount({ meta, field = "status", key, nullKey = false }) {
  if (!meta[field]) {
    return 0
  }

  let count
  const result = meta[field].find((_) => _._id == key)

  count = result ? result.count : 0
  if (nullKey && key == nullKey) {
    const nullsCount = meta[field].find((_) => _._id == null)
    count += nullsCount ? nullsCount.count : 0
  }
  return count
}
