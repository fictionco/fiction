<template>
  <div class="relative z-50 max-w-6xl mx-auto py-4 flex items-center justify-between">
    <site-brand />
    <div>
      <nav class="hidden lg:block">
        <template v-for="(item, index) in siteNav">
          <component :is="item.component()" v-if="item.component" :key="index" />
          <factor-link
            v-else
            :key="index"
            :path="item.path"
            :event="item.event"
            :target="item.target"
            class="px-2"
            :class="{ 'text-white hover:text-teal-500': $route.path==='/' }"
          >
            <factor-icon v-if="item.icon" :icon="item.icon" />
            <span v-if="item.name" v-formatted-text="item.name" />
          </factor-link>
        </template>
      </nav>
    </div>
  </div>
</template>
<script>
import { factorLink, factorIcon } from "@factor/ui"
import { setting } from "@factor/tools"
import Vue from "vue"
export default Vue.extend({
  components: {
    factorLink,
    factorIcon,
    "site-brand": () => import("./el/brand.vue")
  },
  data() {
    return {
      navConfig: setting("site.nav")
    }
  },
  computed: {
    siteNav() {
      return this.navConfig.filter(item => !item.condition || item.condition())
    }
  }
})
</script>
