/* eslint-disable no-console */
export default {
  methods: {
    log(...args) {
      console.log(...args)
    },

    logError(...args) {
      console.error(...args)
    },

    clearConsole() {
      if (typeof console.clear === "function") {
        console.clear()
      }
    },
  },
}
