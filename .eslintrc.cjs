module.exports = {
  extends: ["./@factor/lint/config.cjs"],
  settings: {
    tailwindcss: {
      config: require.resolve("@factor/site/tailwind.config.cjs"),
      officialSorting: true,
    },
  },
}
