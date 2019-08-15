export default Factor => {
  return {
    name: "jobs",
    callback: _s => {
      _s.pre("validate", function(next) {
        next()
      })
    },
    schema: {
      jobLocation: String,
      jobApplyEmail: String,
      jobIcon: [{ type: Factor.$mongo.objectIdType(), ref: "attachment" }]
    }
  }
}
