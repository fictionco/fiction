import { database, initializeApp } from "firebase/app"

import "firebase/database"

import { ApiArguments, DataApi } from "./types"

/**
 * The Firebase API from the client
 */
export const createAPI = async ({
  config,
  version,
}: ApiArguments): Promise<DataApi> => {
  initializeApp(config)
  return database().ref(version)
}
