import { EndpointParameters } from "@factor/endpoint"
import { FactorPost } from "@factor/post/types"

export interface SubscribeUser extends EndpointParameters {
  postId: string
  userId: String
  subscribe: boolean
}

export type ForumTopicFactorPost = FactorPost & {
  flagged?: boolean
  pinned?: boolean
  locked?: boolean
  subscriber?: string[]
}
