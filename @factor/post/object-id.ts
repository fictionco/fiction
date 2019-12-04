import { ObjectId } from "bson"

export const objectIdType = (): ObjectId => new ObjectId()

export function objectId(str: string): ObjectId {
  return new ObjectId(str)
}
