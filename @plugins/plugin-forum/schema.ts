import { objectIdType } from "@factor/post/object-id"
export default {
  name: "forumTopic",
  permissions: {
    create: { accessLevel: 1 }
  },
  schema: {
    follower: [{ type: objectIdType(), ref: "user" }]
  }
}
