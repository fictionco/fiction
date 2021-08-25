<template>
  <footer class="bg-white" aria-labelledby="footerHeading">
    <h2 id="footerHeading" class="sr-only">Footer</h2>
    <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
      <div class="pb-8 grid grid-cols-2 xl:grid xl:grid-cols-5 xl:gap-8">
        <div class="mt-12 col-span-2 lg:col-span-1 lg:mt-0">
          <router-link to="/">
            <ElemLogo mode="icon" class="scheme-standard h-10 w-auto" />
          </router-link>
        </div>

        <div v-for="(col, i) in columns" :key="i" class="mt-12 md:mt-0">
          <h3
            v-if="col.heading"
            class="
              mb-4
              text-xs
              font-semibold
              text-color-400
              tracking-wider
              uppercase
            "
          >
            {{ col.heading }}
          </h3>
          <ul v-if="col.menu" :class="col.class ? col.class : 'space-y-4'">
            <li v-for="(item, ii) in col.menu" :key="ii">
              <a
                :href="item.path"
                class="font-semibold hover:text-primary-500"
                :target="item.target ? item.target : '_self'"
              >
                <template v-if="item.icon">
                  <span class="sr-only">{{ item.name }}</span>
                  <div
                    class="w-6 h-6 text-color-500 hover:text-primary-500"
                    v-html="item.icon"
                  />
                </template>
                <template v-else>
                  {{ item.name }}
                </template>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-8 pt-4 text-sm text-color-500">
        <div class="text-center">
          &copy; 2021 &middot; Released under MIT license
        </div>
        <!-- <div class="text-right">
          <router-link to="/terms-of-service" class="hover:text-primary-500">
            Terms
          </router-link>
          <router-link to="/privacy-policy" class="ml-3 hover:text-primary-500">
            Privacy
          </router-link>
        </div> -->
      </div>
    </div>
  </footer>
</template>
<script lang="ts">
import { ref } from "vue"

import ElemLogo from "./ElemLogo.vue"

export default {
  components: {
    ElemLogo,
  },
  setup() {
    const columns = ref<
      {
        heading?: string
        class?: string
        menu?: {
          name?: string
          path?: string
          icon?: string
          target?: string
        }[]
      }[]
    >([
      {
        heading: "Build Apps",
        menu: [
          { path: "/install", name: "Install" },
          { path: "/docs", name: "Docs" },
        ],
      },
      {
        heading: "Extend",
        menu: [
          { path: "/themes", name: "Themes" },
          { path: "/plugins", name: "Plugins" },
        ],
      },
      {
        heading: "Company",
        menu: [
          {
            path: "https://www.darwin.so/about",
            target: "_blank",
            name: "About",
          },
          {
            path: "https://www.darwin.so/support",
            target: "_blank",
            name: "Support",
          },
        ],
      },
      {
        class: "flex justify-end space-x-6",

        menu: [
          {
            path: "https://www.github.com/FactorJS/factor",
            target: "_blank",
            name: "Github",
            icon: `<svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"></path></svg>`,
          },
          {
            path: "https://www.facebook.com/factorjs",
            target: "_blank",
            name: "Facebook",
            icon: `<svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"   clip-rule="evenodd" /></svg>`,
          },
        ],
      },
    ])

    return {
      columns,
    }
  },
}
</script>
