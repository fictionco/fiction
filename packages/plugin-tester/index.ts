import { UserConfig, safeDirname } from "@factor/api"

export const setup = async (): Promise<UserConfig> => {
  return {
    name: "Tester",
    paths: [safeDirname(import.meta.url)],
  }
}
