export default Factor => {
  return {
    name: "page",
    callback: _s => {
      // _s.pre("save", async function(next) {
      //   this.markModified("settings")
      //   next()
      // })
    },
    schema: Factor.$filters.apply("page-template-schema", {
      template: String
    }),
    options: {}
  }
}
