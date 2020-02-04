import Vue from "vue"
import { createApp } from "./app"

const startClient = async (): Promise<void> => {
  const { vm, router, store } = await createApp({ url: window.location.pathname })

  /**
   * Add to <window> for external use
   *  For example, inside of integration tests
   */
  window.factorApp = { vm, router, store, Vue }

  /**
   * Mount after router has resolved
   */
  router.onReady(() => {
    vm.$mount("#app")
    window.factorReady = true
  })
}

startClient()

/**
 * Webpack hot reload
 * - https://webpack.js.org/api/module-variables/#modulehot-webpack-specific
 */
/* istanbul ignore next */
if (module.hot) {
  module.hot.accept()
}
