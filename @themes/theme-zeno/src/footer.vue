<template>
  <div class="bg-purple-900 text-gray-200 pt-8 mt-8">
    <div
      class="max-w-6xl pt-8 mx-auto py-4 flex items-center justify-between border-t border-gray-800"
    >
      <site-brand />
      <nav>
        <template v-for="(item, index) in footerNav">
          <component :is="item.component()" v-if="item.component" :key="index" />
          <factor-link
            v-else
            :key="index"
            :path="item.path"
            :event="item.event"
            :target="item.target"
            class="px-2 text-gray-500 hover:text-gray-100"
          >
            <factor-icon v-if="item.icon" :icon="item.icon" />
            <span v-if="item.name" v-formatted-text="item.name" />
          </factor-link>
        </template>
      </nav>
    </div>
    <div class="max-w-6xl mx-auto pt-8 pb-4 flex items-center justify-between text-gray-500">
      <div v-formatted-text="footerLeft" class="text-xs" />
      <div v-formatted-text="footerRight" class="text-xs text-right" />
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
      footerNav: setting("footer.nav"),
      footerLeft: setting("footer.left"),
      footerRight: setting("footer.right")
    }
  },
  methods: { setting }
})
</script>
