// import { objectIdType } from "@factor/post/object-id"
import { PostStatus } from "@factor/post/types"
export default {
  name: "extension",

  schema: {
    extensionType: String,
    status: {
      default: PostStatus.Published,
      type: String
    }
  }
}
