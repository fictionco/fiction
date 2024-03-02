import { AppDreambooth } from '../plugin-app-dreambooth'
import { AppWebUi } from '../plugin-app-webui'
import { AppFileBrowser } from '../plugin-app-file-browser'
import { AppCollections } from '../plugin-app-collections'
import type { FictionAppSettings } from './extend'

export function getApps(_: FictionAppSettings) {
  return [
    new AppDreambooth(_),
    new AppWebUi(_),
    new AppFileBrowser(_),
    new AppCollections(_),
  ]
}
