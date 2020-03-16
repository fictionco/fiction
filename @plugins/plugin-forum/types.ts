import { EndpointParameters } from "@factor/endpoint"
import { FactorPost, ObjectId } from "@factor/post/types"

export interface SubscribeUser extends EndpointParameters {
  postId: ObjectId | string;
  userId: string;
  subscribe: boolean;
}

export type ForumTopicFactorPost = FactorPost & {
  flagged?: boolean;
  pinned?: boolean;
  locked?: boolean;
  subscriber?: string[];
}
