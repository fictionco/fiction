import Factor from "vue"
import { createApp } from "./app"

const { app, router, store } = createApp()

// Add to <window> for external use
// For example, inside of integration tests
window.FactorApp = { app, router, store, Factor }

// Mount after router has resolved
router.onReady(() => {
  app.$mount("#app")
  window.FactorReady = true
})

// Webpack hot reload
/* istanbul ignore next */
if (module && module.hot) module.hot.accept()
