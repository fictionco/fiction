import { UserConfig } from "@factor/types"
export const setup = (): UserConfig => {
  return {
    name: "HighlightCode",
    paths: [new URL(".", import.meta.url).pathname],
  }
}
