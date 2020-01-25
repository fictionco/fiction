import Vue from "vue"
import { createApp } from "./app"

const hmr = module?.hot || false

const startClient = async (): Promise<void> => {
  const { vm, router, store } = await createApp()

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
if (hmr) {
  hmr.accept()
}
