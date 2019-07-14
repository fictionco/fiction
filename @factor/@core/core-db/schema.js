export default Factor => {
  return {
    name: "post",
    options: { timestamps: true },
    schema: Factor.$filters.apply("post-schema", {
      postType: { type: String, index: true, sparse: true },
      title: { type: String, trim: true },
      content: { type: String, trim: true },
      author: [{ type: Factor.$mongoose.Schema.Types.ObjectId, ref: "user" }],
      images: [{ type: Factor.$mongoose.Schema.Types.ObjectId, ref: "attachment" }],
      avatar: { type: Factor.$mongoose.Schema.Types.ObjectId, ref: "attachment" },
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
        if (this.images && this.images.length > 0) {
          this.avatar = this.images[0]
        }

        this.postType = this.get("__t") || "post"
        next()
      })
    }
  }
}
