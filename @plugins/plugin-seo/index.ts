import { objectIdType } from "@factor/post/object-id"
import { addFilter, pushToFilter } from "@factor/api"
import { Component } from "vue"
import mongoose from "mongoose"

export const setup = (): void => {
  pushToFilter({
    key: "seoEditPanel",
    hook: "post-edit-components",
    item: {
      name: "SEO and Sharing",
      component: (): Promise<Component> => import("./seo-panel.vue")
    }
  })

  addFilter({
    key: "seoMetaFields",
    hook: "post-schema",
    callback: (_: mongoose.SchemaDefinition): mongoose.SchemaDefinition => {
      return {
        ..._,
        titleTag: { type: String, trim: true },
        descriptionTag: { type: String, trim: true },
        shareImage: { type: objectIdType(), ref: "attachment" }
      }
    }
  })

  pushToFilter({
    key: "shareImage",
    hook: "post-populated-fields",
    item: { field: "shareImage", depth: 20 }
  })
}
setup()
