import mongoose from "mongoose/browser"

export const objectIdType = () => mongoose.Schema.Types.ObjectId

export function objectId(str) {
  return mongoose.Types.ObjectId(str)
}
