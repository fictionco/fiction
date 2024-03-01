module.exports = {
  extends: ["./@factor/lint/config.cjs"],
  settings: {
    tailwindcss: {
      config: require.resolve("@factor/www/tailwind.config.cjs"),
      officialSorting: true,
    },
  },
}
