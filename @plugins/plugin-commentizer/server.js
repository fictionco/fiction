import { objectIdType } from "@factor/post/util"
import { addFilter, pushToFilter, setting } from "@factor/tools"
// Add commentizer post type
pushToFilter("post-types-config", {
  postType: "commentizer",
  nameIndex: "Commentizer",
  nameSingle: "Comment",
  namePlural: "Comments",
  showAdmin: false,
  add: false
})

// Add commentizer post type schema
pushToFilter("data-schemas", {
  name: "commentizer",
  schema: {
    name: { type: String, trim: true },
    email: { type: String, trim: true },
    comment: { type: String, trim: true }
  }
})

// Extend all postTypes listed in factor-settings with extra fields
setting("commentizer.postTypes").forEach(postType => {
  addFilter(`data-schema-${postType}`, schemaConfig => {
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
