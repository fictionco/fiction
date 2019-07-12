export default Factor => {
  return {
    name: "attachment",
    callback: s => {},
    schema: {
      mimetype: String,
      imageData: Buffer,
      size: Number,
      url: String
    },
    options: {}
  }
}
