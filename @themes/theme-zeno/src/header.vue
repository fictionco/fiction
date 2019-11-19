<template>
  <header class="lg:relative lg:z-50 lg:flex lg:justify-between lg:items-center lg:px-4 lg:py-3">
    <div class="flex items-center justify-between px-6 py-3 lg:p-0 lg:flex-1">
      <site-brand />
      <div class="lg:hidden">
        <button type="button" class="block transition focus:outline-none" @click="isOpen = !isOpen">
          <svg class="h-6 w-6 fill-current" viewBox="0 0 24 24">
            <path
              v-if="isOpen"
              fill-rule="evenodd"
              d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
            />
            <path
              v-if="!isOpen"
              fill-rule="evenodd"
              d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
            />
          </svg>
        </button>
      </div>
    </div>
    <nav
      class="px-6 overflow-hidden transition-height lg:block lg:p-0 lg:h-full lg:flex-1 lg:text-center"
      :class="isOpen ? 'pb-6 h-64' : 'h-0'"
    >
      <template v-for="(item, index) in siteNav">
        <component :is="item.component()" v-if="item.component" :key="index" />
        <factor-link
          v-else
          :key="index"
          :path="item.path"
          :event="item.event"
          :target="item.target"
          class="block mt-3 transition-all text-xl lg:inline mt-0 lg:px-1 lg:text-base"
          :class="{ 'lg:text-white lg:hover:text-teal-500': $route.path==='/' }"
        >
          <factor-icon v-if="item.icon" :icon="item.icon" />
          <span v-if="item.name" v-formatted-text="item.name" />
        </factor-link>
      </template>
    </nav>
  </header>
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
      navConfig: setting("site.nav"),
      isOpen: false
    }
  },
  computed: {
    siteNav() {
      return this.navConfig.filter(item => !item.condition || item.condition())
    }
  }
})
</script>
