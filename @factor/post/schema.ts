import { applyFilters } from "@factor/tools/hooks"
import { Schema, Document } from "mongoose"
import { objectIdType } from "./object-id"
import { FactorSchema, FactorPost } from "./types"
export default (): FactorSchema => {
  return {
    name: "post",
    options: { timestamps: true },
    permissions: {
      create: { accessLevel: 1 },
      retrieve: { accessLevel: 100, status: { published: { accessLevel: 0 } } },
      update: { accessLevel: 300, author: true },
      delete: { accessLevel: 300, author: true }
    },
    populatedFields: applyFilters("post-populated-fields", [
      { field: "author", depth: 10 },
      { field: "images", depth: 30 },
      { field: "avatar", depth: 3 }
    ]),
    schema: applyFilters("post-schema", {
      date: Date,
      postType: { type: String, index: true, sparse: true },
      title: { type: String, trim: true },
      subTitle: { type: String, trim: true },
      content: { type: String, trim: true },
      author: [{ type: objectIdType(), ref: "user" }],
      images: [{ type: objectIdType(), ref: "attachment" }],
      avatar: { type: objectIdType(), ref: "attachment" },
      tag: { type: [String], index: true },
      category: { type: [String], index: true },
      revisions: [Object],
      settings: {},
      // Vanilla global schema for of items like comments, emails
      list: {
        type: [Object]
      },
      status: {
        type: String,
        enum: ["published", "draft", "trash"],
        index: true,
        default: "draft"
      },
      uniqueId: {
        type: String,
        trim: true,
        index: { unique: true, sparse: true }
      },
      permalink: {
        type: String,
        trim: true,
        index: { unique: true, sparse: true },
        minlength: 3,
        validator: function(v: string): boolean {
          return /^[\d-a-z]+$/.test(v)
        },
        message: (props: { value: string }): string =>
          `${props.value} is not URL compatible.`
      }
    }),
    callback: (_s: Schema): void => {
      _s.pre("save", function(this: FactorPost & Document, next) {
        this.markModified("settings")

        if (!this.date && this.status == "published") {
          const now = new Date()
          this.date = now.toISOString()
        }

        if (this.images && this.images.length > 0) {
          this.avatar = this.images[0]
        }

        this.postType = this.get("__t") || "post"
        next()
      })
    }
  }
}
