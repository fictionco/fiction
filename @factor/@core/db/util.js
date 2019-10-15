import Factor from "@factor/core"
import schemaPost from "@factor/post/schema"

export const objectIdType = () => Factor.$mongoose.Schema.Types.ObjectId

export function objectId(str) {
  return Factor.$mongoose.Types.ObjectId(str)
}

export function getAddedSchemas() {
  return Factor.$filters.apply("data-schemas", [schemaPost()]).map(schemaConfig => {
    const _s = typeof schemaConfig == "function" ? schemaConfig() : schemaConfig
    return Factor.$filters.apply(`data-schema-${_s.name}`, _s)
  })
}
