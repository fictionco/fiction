module.exports = {
  mode: "jit",
  purge: {
    content: [
      "./src/**/*.{vue,js,ts,jsx,tsx,html}",
      ...require("@factor/server-utils/tailwind").paths,
    ],
  },
}
