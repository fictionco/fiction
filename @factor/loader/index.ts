import { onEvent } from "@factor/api/events"
import { addMiddleware } from "@factor/server/middleware"
import { BuildTypes } from "@factor/cli/types"

import latestVersion from "latest-version"
import { setting, getSettings } from "@factor/api/settings"
import { writeFiles } from "@factor/cli/setup"
import { configSettings } from "@factor/api/config"
import log from "@factor/api/logger"
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

const writeInstallData = async (form: Record<string, any>): Promise<void> => {
  const existingSettings = configSettings()
  const { appName, appUrl, appEmail, email, theme } = form

  const values: Record<string, any> = {
    factor: {
      app: { url: appUrl, name: appName, email: appEmail }
    }
  }

  if (email) {
    values.factor.admins = [...values.factor.admins, email]
  }

  // Add auto-load if they don't have anything
  if (!existingSettings.load) {
    values.factor.load = ["app", "server"]
  }

  if (theme) {
    try {
      const themeVersion = await latestVersion(theme)
      values.dependencies = {
        [theme]: `^${themeVersion}`
      }
    } catch (error) {
      log.error("Added theme was not found.")
    }
  }

  writeFiles("package", values)

  return
}

export const showInstallRoutine = async (): Promise<void> => {
  if (!setting("installed")) {
    setShowInstall()

    await new Promise(resolve => {
      onEvent("loaderEvent", async (data: Record<string, any>) => {
        const { form } = data
        if (form) {
          await writeInstallData(form)
        }

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
