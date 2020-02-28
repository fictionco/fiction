import { applyFilters } from "@factor/api/hooks"
import { Schema, Document } from "mongoose"
import { setting } from "@factor/api/settings"
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
      create: { accessLevel: 100 },
      retrieve: {
        accessLevel: 100,
        accessPublished: 0,
        accessAuthor: true
      },
      update: { accessLevel: 100, accessAuthor: true },
      delete: { accessLevel: 200, accessAuthor: true },
      embedded: {
        create: { accessLevel: 1 },
        retrieve: { accessLevel: 0 },
        update: { accessLevel: 100, accessAuthor: true },
        delete: { accessLevel: 100, accessAuthor: true }
      }
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
      { field: "author", depth: 10, context: "list" },
      { field: "images", depth: 10, context: "single" },
      { field: "avatar", depth: 3, context: "any" }
    ]),
    schema: applyFilters("post-schema", {
      postType: { type: String, index: true, sparse: true },
      date: Date,

      title: { type: String, trim: true },
      synopsis: { type: String, trim: true },
      content: { type: String, trim: true },
      author: [{ type: objectIdType(), ref: "user" }],
      follower: [{ type: objectIdType(), ref: "user" }],
      images: [{ type: objectIdType(), ref: "attachment" }],
      avatar: { type: objectIdType(), ref: "attachment" },
      tag: { type: [String], index: true },
      category: { type: [String], index: true, default: [] },
      /**
       * Source Key - Used to distinguish which app created a post in multi-app databases
       */
      source: { type: String, trim: true, default: setting("package.name"), index: true },
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
      embedded: { type: [Object], select: false },
      embeddedCount: { type: Number, default: 0, index: true },
      status: {
        type: String,
        enum: Object.values(PostStatus),
        index: true,
        default: PostStatus.Draft
      },
      /**
       * Provides a shorter unique identifier, also
       * Allow plugins to set a custom UniqueId that can be referenced without first querying the DB
       */
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
          return /^[\d-az-]+$/.test(v)
        },
        message: (props: { value: string }): string =>
          `permalink ${props.value} is not URL compatible.`
      }
    }),
    callback: (postSchema: Schema): void => {
      /**
       * Add index to allow full-text search
       */
      postSchema.index({
        title: "text",
        content: "text",
        username: "text",
        "embedded.$.title": "text",
        "embedded.$.content": "text"
      })

      postSchema.pre("save", function(this: FactorPost & Document, next) {
        // apparently mongoose can't detect change to object keys
        this.markModified("settings")

        if (!this.date) {
          const now = new Date()
          this.date = now.toISOString()
        }

        this.postType = this.get("__t") || "post"
        next()
      })
    }
  }
}
