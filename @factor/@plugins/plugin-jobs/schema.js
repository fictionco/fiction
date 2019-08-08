export default Factor => {
  return {
    name: "jobs",
    callback: _s => {
      _s.pre("validate", function(next) {
        //console.log("THIS", typeof this.jobIcon)
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
