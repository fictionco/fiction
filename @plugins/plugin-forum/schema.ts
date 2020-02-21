import { objectIdType } from "@factor/post/object-id"
import { PostStatus } from "@factor/post/types"
export default {
  name: "forumTopic",
  permissions: {
    create: { accessLevel: 1 },
    retrieve: { accessLevel: 0 }
  },
  schema: {
    flagged: Boolean,
    pinned: Boolean,
    locked: Boolean,
    subscriber: [{ type: objectIdType(), ref: "user" }],
    /**
     * Override default for status
     * type is required or it errors
     */
    status: {
      default: PostStatus.Published,
      type: String
    }
  }
}
