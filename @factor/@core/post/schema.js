export default Factor => {
  return {
    name: "post",
    options: { timestamps: true },
    populatedFields: [
      { field: "author", depth: 10 },
      { field: "images", depth: 50 },
      { field: "avatar", depth: 0 }
    ],
    schema: Factor.$filters.apply("post-schema", {
      date: Date,
      postType: { type: String, index: true, sparse: true },
      title: { type: String, trim: true },
      subTitle: { type: String, trim: true },
      content: { type: String, trim: true },
      author: [{ type: Factor.$mongo.objectIdType(), ref: "user" }],
      images: [{ type: Factor.$mongo.objectIdType(), ref: "attachment" }],
      avatar: { type: Factor.$mongo.objectIdType(), ref: "attachment" },
      tag: { type: [String], index: true },
      category: { type: [String], index: true },
      revisions: [Object],
      status: {
        type: String,
        enum: ["published", "draft", "trash"],
        index: true,
        default: "draft"
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
