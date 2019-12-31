export default {
  name: "attachment",
  schema: {
    mimetype: String,
    imageData: Buffer,
    size: Number,
    url: String
  },
  permissions: {
    create: { accessLevel: 1 },
    retrieve: {
      accessLevel: 0
    }
  }
}
