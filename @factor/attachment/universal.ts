import { addPostType } from "@factor/api/post-types"

addPostType({
  postType: "attachment",
  schemaDefinition: {
    mimetype: String,
    imageData: Buffer,
    size: Number,
    url: String,
  },
  permissions: {
    create: { accessLevel: 1 },
    retrieve: {
      accessLevel: 0,
    },
  },
})
