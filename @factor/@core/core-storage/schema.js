export default Factor => {
  return {
    name: "Image",
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
