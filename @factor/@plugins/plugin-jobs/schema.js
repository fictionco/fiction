export default Factor => {
  return {
    name: "jobs",
    callback: _s => {},
    schema: {
      jobIcon: { type: Factor.$mongo.objectIdType(), ref: "attachment" },
      //jobIcon: Factor.$mongo.objectIdType(),
      jobLocation: String,
      jobApplyEmail: String
    }
    // name: "attachment",
    // callback: _s => {},
    // schema: {
    //   mimetype: String,
    //   imageData: Buffer,
    //   size: Number,
    //   url: String
    // }
  }
}
