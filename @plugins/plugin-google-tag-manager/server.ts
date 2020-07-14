import { pushToFilter, setting } from "@factor/api"

export const setup = (): void => {
  const googleTagManagerId = setting("googleTagManager.googleTagManagerId")

  const setupTitle = "Plugin: Google Tag Manager"

  if (!googleTagManagerId) {
    pushToFilter({ hook: "setup-needed", key: "tagManager", item: { title: setupTitle } })

    return
  }
}
setup()
