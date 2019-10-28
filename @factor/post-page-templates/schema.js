import { applyFilters } from "@factor/tools"
export default Factor => {
  return {
    name: "page",
    callback: _s => {
      // _s.pre("save", async function(next) {
      //   this.markModified("settings")
      //   next()
      // })
    },
    schema: applyFilters("page-template-schema", {
      template: String
    }),
    options: {}
  }
}
