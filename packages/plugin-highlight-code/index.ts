import { UserConfig, safeDirname } from "@factor/api"
export const setup = (): UserConfig => {
  return {
    name: "HighlightCode",
    paths: [safeDirname(import.meta.url)],
    vite: {
      optimizeDeps: {
        include: ["highlight.js"],
      },
    },
  }
}
