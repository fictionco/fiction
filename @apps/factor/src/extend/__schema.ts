import { postType } from "./util"
export default {
  name: postType,

  schema: {
    extensionType: { type: String, index: true },
    cdnUrl: { type: String },
    files: { type: [Object] },
    maintainer: { type: [Object] },
    downloads: { type: Number },
    packageName: { type: String },
    demo: { type: String },
    version: { type: String },
    homepage: { type: String },
    themeColor: { type: String },
    repositoryUrl: { type: String },
    featured: { type: Boolean },
    extensionAuthor: { type: String },
    icon: { type: String },
    screenshots: { type: [String] },
  },
}
