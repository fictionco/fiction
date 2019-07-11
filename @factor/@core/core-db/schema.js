export default Factor => {
  return {
    name: "Post",
    options: { timestamps: true },
    schema: Factor.$filters.apply("post-schema", {
      postType: { type: String, index: true, sparse: true },
      title: { type: String, trim: true },
      body: { type: String, trim: true },
      author: [{ type: Factor.$mongoose.Schema.Types.ObjectId, ref: "User" }],
      images: [{ type: Factor.$mongoose.Schema.Types.ObjectId, ref: "Image" }],
      avatar: { type: Factor.$mongoose.Schema.Types.ObjectId, ref: "Image" },
      tag: [String],
      category: [String],
      status: {
        type: String,
        enum: ["published", "draft", "trash"],
        index: true
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
      _s.index({ status: 1, postType: 1 }, { sparse: true })
      _s.index({ tag: 1, postType: 1 }, { sparse: true })
      _s.index({ category: 1, postType: 1 }, { sparse: true })

      _s.pre("save", function(next) {
        if (this.images && this.images.length > 0) {
          this.avatar = this.images[0]
        }

        this.postType = this.get("__t") || "Post"
        next()
      })
    }
  }
}
