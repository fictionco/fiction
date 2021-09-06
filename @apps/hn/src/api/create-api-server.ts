import Firebase from "firebase"
import LRU from "lru-cache"

import { listTypesArray, DataApi, ApiArguments } from "./types"

/**
 * Create the NodeJS version of the Firebase API
 */
export const createAPI = async ({ config, version }: ApiArguments): Promise<DataApi> => {
  let api: DataApi
  // this piece of code may run multiple times in development mode,
  // so we attach the instantiated API to `process` to avoid duplications
  if (process.__API__) {
    api = process.__API__
  } else {
    Firebase.initializeApp(config)
    api = process.__API__ = Firebase.database().ref(version)

    api.onServer = true

    // fetched item cache
    api.cachedItems = new LRU({
      max: 1000,
      maxAge: 1000 * 60 * 15 // 15 min cache
    })

    // cache the latest story ids
    api.cachedIds = {}

    const _promises: Promise<void>[] = []

    listTypesArray.forEach(view => {
      const _promise = new Promise<void>((resolve, reject) => {
        api.child(`${view}stories`).on("value", snapshot => {
          if (snapshot && api.cachedIds) {
            api.cachedIds[view] = snapshot.val()
          }
          resolve()
        })
      })
      _promises.push(_promise)
    })

    await Promise.all(_promises)
  }
  return api
}
