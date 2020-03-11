import { onEvent } from "@factor/api/events"
import { addMiddleware } from "@factor/server/middleware"
import { BuildTypes } from "@factor/cli/types"

import { setting } from "@factor/api/settings"

import {
  initializeLoading,
  setLoadingStates,
  setLoadingError,
  serveIndex,
  setShowInstall
} from "./loading"

export const initLoader = (): void => {
  const app = initializeLoading()

  addMiddleware({
    path: "/_loading",
    middleware: [app]
  })

  onEvent(
    "buildProgress",
    (build: BuildTypes, progress: { progress: number; message: string }) => {
      setLoadingStates(build, progress)
    }
  )

  onEvent("buildError", (error: Error) => {
    setLoadingError(error)
  })
}

export const showInstallRoutine = async (): Promise<void> => {
  if (!setting("installed")) {
    setShowInstall()

    await new Promise(resolve => {
      onEvent("loaderEvent", (data: Record<string, any>) => {
        if (data.installed) {
          resolve()
        }
      })
    })
  }

  return
}

export const renderLoading = (): string => {
  return serveIndex()
}
