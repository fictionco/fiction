import { ObjectId } from "bson"

// taken from mongoose
Object.defineProperty(ObjectId.prototype, "_id", {
  enumerable: false,
  configurable: true,
  get: function() {
    return this
  }
})

export const objectIdType = (): any => ObjectId

export function objectId(str: string): ObjectId {
  return new ObjectId(str)
}
