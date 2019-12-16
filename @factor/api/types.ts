import "vue"
import { CurrentUserState } from "@factor/user/types"
declare module "vue/types/vue" {
  export interface VueConstructor {
    $factorSettings: object;
    $initializedUser: Promise<CurrentUserState> | CurrentUserState;
    $restartingServer: boolean;
  }
}
