import { Types, Schema } from "mongoose"

export const objectIdType = (): typeof Schema.Types.ObjectId => Schema.Types.ObjectId

export function objectId(str: string): Types.ObjectId {
  return Types.ObjectId(str)
}

export function createObjectId(): Types.ObjectId {
  return new Types.ObjectId()
}
