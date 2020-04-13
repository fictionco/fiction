<template>
  <footer class="bg-purple-900 text-gray-200 p-8 lg:px-4">
    <div class="relative max-w-6xl mx-auto flex flex-col md:flex-row justify-between">
      <figure
        v-if="footerFigure"
        class="absolute top-0 left-0 z-20 hidden ml-56 -mt-16 lg:block"
      >
        <img :src="footerFigure" :alt="footerFigureAlt" />
      </figure>
      <div>
        <factor-link v-if="footerLogoInverse" path="/">
          <img :src="footerLogoInverse" :alt="setting('home.meta.title')" class="h-8" />
        </factor-link>
        <factor-link v-else-if="footerLogo" path="/">
          <img :src="footerLogo" :alt="setting('home.meta.title')" class="h-8" />
        </factor-link>
      </div>
      <nav v-if="footerNav" class="mt-8 w-full flex flex-wrap md:block md:w-auto md:mt-0">
        <template v-for="(item, index) in footerNav">
          <component :is="item.component()" v-if="item.component" :key="index" />
          <factor-link
            v-else
            :key="index"
            :path="item.path"
            :event="item.event"
            :target="item.target"
            class="block text-xl mt-3 px-2 w-1/2 text-gray-500 hover:text-gray-100 md:text-base md:inline"
          >
            <factor-icon v-if="item.icon" :icon="item.icon" />
            <span v-if="item.name" v-formatted-text="item.name" />
          </factor-link>
        </template>
      </nav>
    </div>
    <div class="max-w-6xl mx-auto pt-8 flex items-center justify-between text-gray-500">
      <div v-if="footerLeft" v-formatted-text="footerLeft" class="text-xs" />
      <div class="text-xs text-right">
        <span v-if="footerRight" v-formatted-text="footerRight" />
        <span v-else-if="footerRight === ''" />
        <span v-else>&copy; {{ currentyear() }}</span>
      </div>
    </div>
  </footer>
</template>
<script lang="ts">
import { factorLink, factorIcon } from "@factor/ui"
import { setting } from "@factor/api"
import Vue from "vue"
export default Vue.extend({
  components: {
    factorLink,
    factorIcon,
    "site-brand": () => import("./el/brand.vue"),
  },
  data() {
    return {
      footerLogo: setting("site.logo"),
      footerLogoInverse: setting("site.logoInverse"),
      footerNav: setting("footer.nav"),
      footerLeft: setting("footer.left"),
      footerRight: setting("footer.right"),
      footerFigure: setting("footer.figure"),
      footerFigureAlt: setting("footer.figureAlt"),
    }
  },
  methods: {
    setting,
    currentyear(this: any) {
      return new Date().getFullYear()
    },
  },
})
</script>
