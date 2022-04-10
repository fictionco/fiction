import { UserConfig } from "@factor/api/types"

export const setup = (): UserConfig => {
  return {
    name: "NotifyPlugin",
    paths: [new URL(".", import.meta.url).pathname],
  }
}
