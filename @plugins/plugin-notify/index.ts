import { UserConfig } from "@factor/types"

export const setup = (): UserConfig => {
  return {
    name: "NotifyPlugin",
    paths: [new URL(".", import.meta.url).pathname],
  }
}
