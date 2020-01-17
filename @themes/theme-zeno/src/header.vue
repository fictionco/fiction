<template>
  <header class="justify-between md:items-center zeno-header" :class="headerClasses()">
    <div class="relative z-40">
      <site-brand
        v-if="loading === false && (navLogo || navLogoInverse)"
        class="brand block px-6 py-3"
      />
    </div>
    <div v-if="navConfig" class="relative z-50 flex flex-row md:hidden">
      <button
        type="button"
        class="appearance-none block transition-all cursor-pointer focus:outline-none active:bg-transparent py-3 px-6"
        @click="isOpen = !isOpen"
      >
        <svg class="h-6 w-6 fill-purple" viewBox="0 0 24 24">
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
    <div
      v-if="navConfig"
      class="popup transition-all rounded-lg bg-gray-100 absolute pt-6 md:relative md:opacity-100 md:h-auto md:bg-transparent md:pt-0"
      :class="isOpen ? 'z-40 opacity-100 h-auto' : 'z-0 overflow-hidden h-0 opacity-0'"
    >
      <h4 class="px-8 custom-uppercase text-gray-600 md:hidden">Menu</h4>
      <nav>
        <ul
          class="flex flex-wrap list-none list-inside px-6 py-3 lg:items-center"
          :class="navClass()"
        >
          <li v-for="(item, index) in siteNav" :key="index" class="w-1/2 md:w-auto">
            <component :is="item.component()" v-if="item.component" />
            <factor-link
              v-else
              :key="index"
              :path="item.path"
              :event="item.event"
              :target="item.target"
              class="mt-0 py-1 px-2 font-normal leading-loose text-xl transition-all text-purple-900 hover:bg-gray-100 hover:text-purple-900 md:hover:bg-transparent md:inline md:px-3 md:text-base md:hover:text-purple-500"
              @click="isOpen = !isOpen"
            >
              <factor-icon v-if="item.icon" :icon="item.icon" />
              <span v-if="item.name" v-formatted-text="item.name" />
            </factor-link>
          </li>
        </ul>
      </nav>
    </div>
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
      loading: true,
      navLogo: setting("site.logo"),
      navLogoInverse: setting("site.logoInverse"),
      navConfig: setting("site.nav"),
      isOpen: false
    }
  },
  computed: {
    siteNav(this: any) {
      return this.navConfig.filter((item: any) => !item.condition || item.condition())
    }
  },
  mounted: function() {
    this.loading = false
  },
  methods: {
    headerClasses(this: any) {
      if (this.$route.path != "/") {
        return "max-w-6xl mx-auto border-b border-gray-200 md:px-4"
      } else {
        return "w-full max-w-6xl absolute md:max-w-full"
      }
    },
    navClass(this: any) {
      if (this.$route.path != "/") {
        return "md:justify-end"
      } else {
        return "md:justify-center"
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

  .brand {
    transition: 0.15s cubic-bezier(0.52, 0.01, 0.16, 1);
  }

  @media (max-width: 1024px) {
    display: flex;
  }
  .popup {
    left: 10px;
    top: 5px;
    right: 10px;
    perspective: 2000px;
    box-shadow: 0 50px 100px -20px rgba(50, 50, 93, 0.25),
      0 30px 60px -30px rgba(0, 0, 0, 0.3), 0 -18px 60px -10px rgba(0, 0, 0, 0.025);
    transform-origin: 100% 0;
    @media (min-width: 768px) {
      left: 0;
      top: 0;
      right: 0;
      box-shadow: none;
    }
  }
}
</style>