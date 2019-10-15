import Factor from "@factor/core"

export const objectIdType = () => Factor.$mongoose.Schema.Types.ObjectId

export function objectId(str) {
  return Factor.$mongoose.Types.ObjectId(str)
}

export function getSchemas() {
  return Factor.$filters
    .apply("data-schemas", [require("@factor/post/schema").default(Factor)])
    .map(schemaConfig => {
      const _s = typeof schemaConfig == "function" ? schemaConfig() : schemaConfig
      return Factor.$filters.apply(`data-schema-${_s.name}`, _s)
    })
}
