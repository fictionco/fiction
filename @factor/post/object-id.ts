import { ObjectId } from "bson"

// This code is taken from mongoose trying to duplicate the mongoose type for schemas
// this reduces bundle size while allowing schemas in app/server environments
Object.defineProperty(ObjectId.prototype, "_id", {
  enumerable: false,
  configurable: true,
  get: function() {
    return this
  }
})

// const objectIdSymbol = Symbol("mongoose#ObjectId")
// ObjectId.prototype:  { [key in symbol]: boolean }
// ObjectId.prototype[objectIdSymbol] = true

export const objectIdType = (): any => ObjectId

export const objectId = (str?: string): ObjectId => {
  return new ObjectId(str)
}
