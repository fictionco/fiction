import Factor from "@factor/core"

export function getModel(postType) {
  return Factor.$postServer.db.model(postType)
}

export async function savePost(_parameters, meta = {}) {
  return await Factor.$postServer.save(_parameters, meta)
}

export async function getSinglePost(_parameters, meta = {}) {
  return await Factor.$postServer.single(_parameters, meta)
}
