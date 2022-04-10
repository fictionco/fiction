import { UserConfig } from "@factor/api"
export const setup = (): UserConfig => {
  return {
    name: "HighlightCode",
    paths: [new URL(".", import.meta.url).pathname],
  }
}
