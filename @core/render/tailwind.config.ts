export default {
  mode: "jit",
  content: [
    "./src/**/*.{vue,js,ts,jsx,tsx,html}",
    "@factor/ui/*.vue",
    "@factor/plugin-notify/*.vue",
  ],
} as Record<string, any>
