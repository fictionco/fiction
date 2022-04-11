import { UserConfig, safeDirname } from "@factor/api"

export const setup = (): UserConfig => {
  return {
    name: "NotifyPlugin",
    paths: [safeDirname(import.meta.url)],
  }
}
