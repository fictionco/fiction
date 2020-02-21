import { addPostSchema } from "@factor/post/util"
import forumSchema from "./schema"
import { addEndpoint } from "@factor/api/endpoints"
addPostSchema(() => forumSchema)

export const isSubscribed = (): boolean => {
  return true
}

export const setSubsribed = (): boolean => {
  return true
}

addEndpoint({ id: "forum", handler: { isSubscribed, setSubsribed } })
