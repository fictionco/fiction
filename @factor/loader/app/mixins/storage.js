const baseKey = "__factor_loading_screen_"

export default {
  methods: {
    createItemKey(key) {
      return `${baseKey}${key}`
    },

    storeItem(key, value) {
      try {
        sessionStorage.setItem(this.createItemKey(key), `${value}`)
      } catch (error) {
        console.error(error) // eslint-disable-line no-console
      }
    },

    retrieveItem(key) {
      return sessionStorage.getItem(this.createItemKey(key))
    },

    removeItem(key) {
      sessionStorage.removeItem(this.createItemKey(key))
    }
  }
}
