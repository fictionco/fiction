import { onEvent } from "@factor/api/events"
import { addMiddleware } from "@factor/server/middleware"
import { BuildTypes } from "@factor/cli/types"
import {
  initializeLoading,
  setLoadingStates,
  setLoadingError,
  serveIndex
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

export const renderLoading = (): string => {
  return serveIndex()
}
