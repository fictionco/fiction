import { safeDirname } from "../../utils"
import { UserConfig } from "../../plugin-env"
export const setup = (): UserConfig => {
  return {
    plugins: [],
    server: () => {
      return {
        variables: { TEST_SERVER: "TEST" },
        root: safeDirname(import.meta.url, ".."),
      }
    },
  }
}
