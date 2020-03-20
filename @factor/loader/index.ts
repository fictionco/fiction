import { onEvent } from "@factor/api/events"
import { addMiddleware } from "@factor/server/middleware"
import { BuildTypes } from "@factor/cli/types"

import latestVersion from "latest-version"
import { addCallback } from "@factor/api/hooks"
import { createNewAdminUser } from "@factor/user/server"
import { setting } from "@factor/api/settings"
import { writeFiles, addNotice } from "@factor/cli/setup"
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
  const {
    appName,
    appDescription,
    appUrl,
    appEmail,
    displayName,
    email,
    password,
    theme
  } = form

  const values: Record<string, any> = {
    factor: {
      app: { name: appName, description: appDescription, url: appUrl, email: appEmail }
    }
  }

  if (email) {
    const { factor: { admins = [] } = {} } = existingSettings
    values.factor.admins = [...admins, email]
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

  log.diagnostic({ event: "factorInstall", action: "factorSetup", label: email })

  addCallback({
    key: "addAdmin",
    hook: "db-initialized",
    callback: async (): Promise<void> => {
      if (email && password) {
        let user
        try {
          user = await createNewAdminUser({ displayName, email, password })
        } catch (error) {
          addNotice(
            `Couldn't create a user for: ${email}. Likely the email already exists in the DB.`
          )
        }

        if (user) {
          addNotice(`New admin created for: ${user.email}`)
        }
      }
    }
  })

  writeFiles("package", values)

  return
}

export const showInstallRoutine = async (): Promise<void> => {
  if (!setting("installed") && process.env.FACTOR_ENV !== "test") {
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
