import path from "path"
import { createRequire } from "module"

const require = createRequire(import.meta.url)

const modulePath = (mod: string): string =>
  path.dirname(require.resolve(`${mod}/package.json`))

export default {
  mode: "jit",
  content: [
    "./src/**/*.{vue,js,ts,jsx,tsx,html}",
    `${modulePath("@factor/ui")}/*.vue`,
    `${modulePath("@factor/plugin-notify")}/*.vue`,
  ],
} as Record<string, any>
