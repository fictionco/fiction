export default () => {
  return {
    name: "attachment",
    schema: {
      mimetype: String,
      imageData: Buffer,
      size: Number,
      url: String
    }
  }
}
