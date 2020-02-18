import { objectIdType } from "@factor/post/object-id"
import { PostStatus } from "@factor/post/types"
export default {
  name: "forumTopic",
  permissions: {
    create: { accessLevel: 1 }
  },
  schema: {
    follower: [{ type: objectIdType(), ref: "user" }],
    flagged: Boolean,
    pinned: Boolean,
    locked: Boolean,
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
