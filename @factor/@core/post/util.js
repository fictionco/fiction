import Factor from "@factor/core"
import schemaPost from "@factor/post/schema"

export const objectIdType = () => Factor.$mongoose.Schema.Types.ObjectId

export function objectId(str) {
  return Factor.$mongoose.Types.ObjectId(str)
}

export function isAuthor(bearer) {
  return bearer.accessLevel >= 300 ? {} : { author: bearer._id }
}

export function getAddedSchemas() {
  return Factor.$filters.apply("data-schemas", [schemaPost()]).map(s => {
    return Factor.$filters.apply(
      `data-schema-${s.name}`,
      typeof s == "function" ? s() : s
    )
  })
}

export function getSchema(postType) {
  const schemas = getAddedSchemas()

  return schemas.find(s => s.name == postType)
}

export function getPopulatedFields({ postType = "post", depth = 10 }) {
  let fields = getSchema("post").populatedFields || []

  const schema = getSchema(postType)

  if (postType != "post" && schema) {
    const postTypePopulated = schema.populatedFields || []
    fields = [...fields, ...postTypePopulated]
  }

  const pop = fields.filter(_ => _.depth <= depth).map(_ => _.field)

  return pop
}

export function canUpdatePost({ user, post, action, isNew }) {
  const schema = getSchema(post.__t)

  if (isNew && action == "save" && schema.anonymousUserCanCreate) {
    return true
  } else if (
    bearer &&
    (bearer.accessLevel >= 300 ||
      post.author.includes(bearer._id) ||
      bearer._id.toString() == post._id.toString())
  ) {
    return true
  } else {
    throw new Error("Insufficient permissions.")
  }
}
