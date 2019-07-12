export default Factor => {
  return {
    name: "page",
    callback: _s => {
      _s.pre("save", async function(next) {
        const post = this
        post.markModified("settings")
        next()
      })
    },
    schema: Factor.$filters.apply("page-schema", {
      template: String,
      settings: {}
    }),
    options: {}
  }
}
