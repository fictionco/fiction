import { userConfigSetting } from "../config/plugins"

const pluginPaths = userConfigSetting("paths") || []
const paths = pluginPaths.flatMap((p) => [`${p}/*.vue`, `${p}/**/*.vue`])

export default {
  mode: "jit",
  content: ["./src/**/*.{vue,js,ts,html}", ...paths],
} as Record<string, any>
