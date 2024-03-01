import { safeDirname } from "@factor/api/utils"
import { ServiceConfig } from "@factor/api/plugin-env"
export const setup = (): ServiceConfig => {
  return {
    plugins: {},
    server: () => {
      return {
        variables: { TEST_SERVER: "TEST" },
        root: safeDirname(import.meta.url, ".."),
      }
    },
  }
}
