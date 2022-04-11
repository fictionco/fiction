import { userConfigSetting } from "../engine/plugins"

const pluginPaths = userConfigSetting("paths") || []
const paths = pluginPaths.map((p) => `${p}**/*.vue`)

export default {
  mode: "jit",
  content: ["./src/**/*.{vue,js,ts,html}", ...paths],
} as Record<string, any>
