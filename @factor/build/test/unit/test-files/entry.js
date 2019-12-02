// @ts-nocheck

import Vue from "vue"
import component from "./test-vue.vue"
Vue.config.productionTip = false
Vue.config.silent = false
Vue.config.devtools = false
const app = new Vue({
  render: h => h(component)
})
app.$mount("#app")
