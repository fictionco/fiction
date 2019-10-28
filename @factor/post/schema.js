import { objectIdType } from "@factor/post/util"
import { applyFilters } from "@factor/filters/util"
export default () => {
  return {
    name: "post",
    options: { timestamps: true },
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
        validator: function(v) {
          return /^[a-z0-9-]+$/.test(v)
        },
        message: props => `${props.value} is not URL compatible.`
      }
    }),
    callback: _s => {
      _s.pre("save", function(next) {
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
