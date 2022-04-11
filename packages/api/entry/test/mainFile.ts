import { safeDirname } from "../../utils"
import { UserConfig } from "../../types"
export const setup = (): UserConfig => {
  return {
    routes: [],
    plugins: [],
    server: () => {
      return {
        variables: { TEST_SERVER: "TEST" },
        root: safeDirname(import.meta.url, ".."),
      }
    },
  }
}
