import { applyFilters } from "@factor/api/hooks"
import { Schema, Document } from "mongoose"
import { setting } from "@factor/api/settings"
import { randomToken } from "@factor/api/utils"
import { objectIdType } from "./object-id"
import { FactorSchema, FactorPost, PostStatus } from "./types"
/**
 * Base post schema
 * This schema is inherited and extended by all other post types
 */
export default (): FactorSchema => {
  return {
    name: "post",
    options: { timestamps: true },

    /**
     * This handles the permissions for different types of CRUD operations on the
     * default post type. These can be changed by extending post types
     */
    permissions: {
      create: { accessLevel: 300 },
      retrieve: {
        accessLevel: 300,
        status: { published: { accessLevel: 0 } },
        author: true
      },
      list: {
        accessLevel: 300,
        author: true,
        status: { published: { accessLevel: 0 } }
      },
      update: { accessLevel: 100, author: true },
      delete: { accessLevel: 300, author: true }
    },
    /**
     * populatedFields are how Factor knows which fields should be populated
     * by other posts. (This is equivalent to a join in SQL speak.)
     *
     * in the schema, you'll see that only a reference objectId or array of ObjectIds is stored
     * for the populated field
     *
     * depth is used by queries to determine the level of population needed.
     * For example, for listing many posts, you might need only a depth of 5
     * but for viewing an individual post you'd want a depth of 30
     */
    populatedFields: applyFilters("post-populated-fields", [
      { field: "author", depth: 10 },
      { field: "images", depth: 10 },
      { field: "avatar", depth: 3 }
    ]),
    schema: applyFilters("post-schema", {
      postType: { type: String, index: true, sparse: true },
      date: Date,

      title: { type: String, trim: true },
      synopsis: { type: String, trim: true },
      content: { type: String, trim: true },
      // populated field
      author: [{ type: objectIdType(), ref: "user" }],
      // populated field
      images: [{ type: objectIdType(), ref: "attachment" }],
      // populated field
      avatar: { type: objectIdType(), ref: "attachment" },
      tag: { type: [String], index: true },
      category: { type: [String], index: true, default: ["general"] },
      /**
       * Source Key - Used to distinguish which app created a post in multi-app databases
       */
      source: { type: String, trim: true, default: setting("package.name") },
      /**
       * Settings is a vanilla key/value container
       */
      settings: {},
      /**
       * List is a vanilla list container
       */
      list: { type: [Object] },
      /**
       * Embedded documents (comments, posts, etc.)
       */
      embedded: { type: [Object] },
      embeddedCount: Number,
      status: {
        type: String,
        enum: [PostStatus.Published, PostStatus.Draft, PostStatus.Trash],
        index: true,
        default: PostStatus.Published
      },
      /**
       * Allow plugins to set a custom UniqueId that can be referenced without first querying the DB
       */
      uniqueId: {
        type: String,
        trim: true,
        index: { unique: true, sparse: true },
        default: (): string => randomToken(8)
      },
      permalink: {
        type: String,
        trim: true,
        index: { unique: true, sparse: true },
        minlength: 3,
        default: (): string => randomToken(8),
        validator: function(v: string): boolean {
          return /^[\d-a-z]+$/.test(v)
        },
        message: (props: { value: string }): string =>
          `permalink ${props.value} is not URL compatible.`
      }
    }),
    callback: (postSchema: Schema): void => {
      /**
       * Add index to allow full-text search
       */
      postSchema.index({ title: "text", content: "text" })

      postSchema.pre("save", function(this: FactorPost & Document, next) {
        // apparently mongoose can't detect change to object keys
        this.markModified("settings")

        if (!this.date) {
          const now = new Date()
          this.date = now.toISOString()
        }

        if (!this.avatar && this.images && this.images.length > 0) {
          this.avatar = this.images[0]
        }

        this.postType = this.get("__t") || "post"
        next()
      })
    }
  }
}
