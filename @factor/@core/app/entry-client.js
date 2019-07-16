import Factor from "vue"
import { createApp } from "./app"

const { app, router, store } = createApp({ target: "client" })

// Add to <window> for external use
// For example, inside of Cypress integration tests
window.FactorApp = { app, router, store, Factor }
window.appReady = true

router.onReady(() => {
  app.$mount("#app")
})

if (module.hot) {
  module.hot.accept()
}
