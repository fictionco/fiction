<template>
  <header class="overflow-hidden" :class="headerClasses()">
    <div class="z-50 px-6 py-3">
      <site-brand class="hidden lg:block" :inverse="brandInverse()" />
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
      class="px-6 py-3 overflow-hidden transition-height lg:bg-transparent lg:inline lg:h-full lg:flex-1 lg:text-center"
      :class="isOpen ? 'bg-white w-full h-188 z-50 lg:w-auto' : 'min-h-0 h-0'"
    >
      <ul
        class="flex flex-col list-none list-inside pb-6 lg:pb-0 lg:w-auto lg:flex-row lg:flex-1 lg:justify-center"
      >
        <template v-for="(item, index) in siteNav">
          <li :key="index" class="mt-1 lg:m-0">
            <component :is="item.component()" v-if="item.component" />
            <factor-link
              v-else
              :key="index"
              :path="item.path"
              :event="item.event"
              :target="item.target"
              class="transition-all text-xl py-1 px-2 mt-0 hover:bg-gray-100 hover:text-purple-500 lg:hover:bg-transparent lg:inline lg:px-3 lg:text-base"
              :class="navLinkClass()"
              @click="isOpen = !isOpen"
            >
              <factor-icon v-if="item.icon" :icon="item.icon" />
              <span v-if="item.name" v-formatted-text="item.name" />
            </factor-link>
          </li>
        </template>
      </ul>
    </nav>
  </header>
</template>
<script lang="ts">
import { factorLink, factorIcon } from "@factor/ui"
import { setting } from "@factor/api"
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
      isOpen: false,
      headerHome: false
    }
  },
  computed: {
    siteNav(this: any) {
      return this.navConfig.filter((item: any) => !item.condition || item.condition())
    }
  },
  methods: {
    brandInverse(this: any) {
      if (this.$route.path != "/") {
        return false
      } else {
        return true
      }
    },
    headerClasses(this: any) {
      if (this.$route.path != "/") {
        //return "lg:px-4 lg:py-3"
        return "w-full lg:z-50 lg:justify-between lg:items-center lg:px-4 zeno-header"
      } else {
        return "w-full absolute lg:z-50 lg:justify-between lg:items-center lg:px-4 lg:pt-4 zeno-header"
      }
    },
    navLinkClass(this: any) {
      if (this.$route.path != "/") {
        return "lg:hover:text-purple-900"
      } else {
        return "lg:hover:text-purple-900"
      }
    }
  }
})
</script>

<style lang="less">
.zeno-header {
  display: grid;
  grid-template-columns: 1fr minmax(750px, 1fr);
  grid-gap: 0;
}
</style>