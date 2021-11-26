import { paths } from "@factor/server-utils/tailwind"
export default {
  mode: "jit",
  purge: {
    content: ["./src/**/*.{vue,js,ts,jsx,tsx,html}", ...paths],
  },
} as Record<string, any>
