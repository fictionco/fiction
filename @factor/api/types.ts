import "vue"
import { CurrentUserState } from "@factor/user/types"
import { SettingsRecords } from "@factor/api/settings"

declare module "vue/types/vue" {
  export interface VueConstructor {
    $factorSettings: SettingsRecords;
    $initializedUser: Promise<CurrentUserState> | CurrentUserState;
    $userIsInitialized?: boolean;
    $restartingServer: boolean;
  }
}
