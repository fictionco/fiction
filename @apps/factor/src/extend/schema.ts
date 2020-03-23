// import { objectIdType } from "@factor/post/object-id"
import { PostStatus } from "@factor/post/types"
import { postType } from "./util"
export default {
  name: postType,

  schema: {
    extensionType: { type: String, index: true },
    status: {
      default: PostStatus.Published,
      type: String
    },
    cdnUrl: { type: String },
    files: { type: [Object] },
    maintainer: { type: [Object] },
    downloads: { type: Number },
    packageName: { type: String },
    demo: { type: String },
    version: { type: String },
    homepage: { type: String },
    repositoryUrl: { type: String },
    featured: { type: Boolean },
    extensionAuthor: { type: String },
    icon: { type: String },
    screenshots: { type: [String] }
  }
}
