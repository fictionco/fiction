import Vue from "vue"
import { createApp } from "./app"

const startClient = async () => {
  const { vm, router, store } = await createApp()

  // Add to <window> for external use
  // For example, inside of integration tests
  window.factorApp = { vm, router, store, Vue }

  // Mount after router has resolved
  router.onReady(() => {
    vm.$mount("#app")
    window.factorReady = true
  })
}

startClient()

// Webpack hot reload
/* istanbul ignore next */
if (module && module.hot) module.hot.accept()
