import { applyFilters, pushToFilter } from "@factor/tools/filters"
export * from "./object-id"
import postSchema from "@factor/post/schema"
import { FactorSchema, FactorSchemaModule, DetermineUpdatePermissions } from "./types"

export function extendPostSchema(config: FactorSchemaModule): void {
  pushToFilter("data-schemas", config)
}

export function getAddedSchemas(): FactorSchema[] {
  return applyFilters("data-schemas", [postSchema()]).map((s: FactorSchemaModule) => {
    return applyFilters(`data-schema-${s.name}`, typeof s == "function" ? s() : s)
  })
}

export function getSchema(postType: string): FactorSchema {
  const schemas = getAddedSchemas()

  return schemas.find(s => s.name == postType) ?? postSchema()
}

export function getSchemaPopulatedFields({
  postType = "post",
  depth = 10
}: {
  postType: string;
  depth: number;
}): string[] {
  let fields = getSchema("post").populatedFields || []

  const schema = getSchema(postType)

  if (postType != "post" && schema) {
    const postTypePopulated = schema.populatedFields || []
    fields = [...fields, ...postTypePopulated]
  }

  const pop = fields.filter(_ => _.depth <= depth).map(_ => _.field)

  return pop
}

export function canUpdatePost({
  bearer,
  post,
  action
}: DetermineUpdatePermissions): boolean {
  if (process.env.FACTOR_ENV == "test") return true

  const schema = getSchema(post.__t)

  const accessLevel = bearer?.accessLevel ?? 0
  const _id = bearer?._id ? bearer._id.toString() : ""
  const authors = post.author ? post.author.map(_ => _.toString()) : []
  const postId = post._id.toString()

  if (action == "create" && schema.anonymousUserCanCreate) {
    return true
  } else if (
    bearer &&
    (accessLevel >= 300 || (_id && authors.includes(_id)) || _id == postId)
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
  const result = meta[field].find(_ => _._id == key)

  count = result ? result.count : 0
  if (nullKey && key == nullKey) {
    const nullsCount = meta[field].find(_ => _._id == null)
    count += nullsCount ? nullsCount.count : 0
  }
  return count
}
