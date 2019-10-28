import { objectIdType } from "@factor/post/util"

export default Factor => {
  return new (class {
    constructor() {
      // Add commentizer post type
      Factor.$filters.push("post-types", {
        postType: "commentizer",
        nameIndex: "Commentizer",
        nameSingle: "Comment",
        namePlural: "Comments",
        showAdmin: false,
        add: false
      })

      // Add commentizer post type schema
      Factor.$filters.push("data-schemas", {
        name: "commentizer",
        schema: {
          name: { type: String, trim: true },
          email: { type: String, trim: true },
          comment: { type: String, trim: true }
        }
      })

      // Extend all postTypes listed in factor-settings with extra fields
      Factor.$setting.get("commentizer.postTypes").forEach(postType => {
        Factor.$filters.add(`data-schema-${postType}`, schemaConfig => {
          schemaConfig.schema = {
            ...schemaConfig.schema,
            commentizerEnabled: { type: Boolean, default: false },
            commentizerComments: [
              {
                type: objectIdType(),
                ref: "commentizer"
              }
            ]
          }

          // TODO: Fix - NOT WORKING!!!
          schemaConfig.populatedFields = [{ field: "commentizerComments", depth: 10 }]
          return schemaConfig
        })
      })
    }
  })()
}
