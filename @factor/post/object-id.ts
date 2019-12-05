import { ObjectId } from "bson"

Object.defineProperty(ObjectId.prototype, "_id", {
  enumerable: false,
  configurable: true,
  get: function() {
    return this
  }
})

const objectIdSymbol = Symbol("mongoose#ObjectId")

// @ts-ignore
//ObjectId.prototype[objectIdSymbol] = true

export const objectIdType = (): any => ObjectId

export function objectId(str: string): ObjectId {
  return new ObjectId(str)
}
