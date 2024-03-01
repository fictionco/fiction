<template>
  <div class="relative z-10 overflow-y-visible">
    <div class="relative py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav
          class="relative flex items-center justify-between sm:h-10 lg:justify-center"
          aria-label="Global"
        >
          <div
            class="flex items-center flex-1 lg:absolute lg:inset-y-0 lg:left-0"
          >
            <div class="flex items-center justify-between w-full lg:w-auto">
              <router-link
                to="/"
                class="transform transition duration-500 hover:scale-105"
              >
                <ElemLogo mode="logo" class="scheme-standard h-6 w-auto" />
              </router-link>
            </div>
          </div>
          <div class="hidden lg:flex md:space-x-10">
            <template v-for="(navItem, i) in siteNav" :key="i">
              <a
                v-if="navItem.submenu == null"
                :href="navItem.path"
                class="text-gray-300 hover:text-white"
              >
                {{ navItem.name }}
              </a>
              <div v-else class="relative">
                <button
                  type="button"
                  class="group rounded-md inline-flex items-center text-base hover:text-white focus:outline-none"
                  :class="navItem.visDropdown ? 'text-white' : 'text-gray-300'"
                  @click.stop="toggleVisibilityDropdown(navItem)"
                >
                  <span>{{ navItem.name }}</span>
                  <svg
                    class="ml-2 h-5 w-5 group-hover:text-white"
                    :class="
                      navItem.visDropdown ? 'text-white' : 'text-gray-300'
                    "
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>

                <transition
                  enter-active-class="transition ease-out duration-200"
                  enter-class="opacity-0 translate-y-1"
                  enter-to-class="opacity-100 translate-y-0"
                  leave-active-class="transition ease-in duration-150"
                  leave-class="opacity-100 translate-y-0"
                  leave-to-class="opacity-0 translate-y-1"
                >
                  <div
                    v-show="navItem.visDropdown"
                    class="absolute z-50 left-1/2 transform -translate-x-1/2 mt-3 px-2 w-screen max-w-xs sm:px-0"
                  >
                    <div
                      class="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden"
                    >
                      <div
                        class="relative bg-gray-100 py-6 px-5 grid gap-6 sm:gap-8 sm:p-8"
                      >
                        <a
                          v-for="(submenuItem, ii) in navItem.submenu"
                          :key="ii"
                          :href="submenuItem.path"
                          class="-m-3 p-3 flex items-start rounded-lg hover:bg-gray-200"
                        >
                          <span
                            v-if="submenuItem.icon"
                            class="shrink-0 h-6 w-6 text-color-900"
                            v-html="submenuItem.icon"
                          />

                          <div class="ml-4">
                            <p
                              class="text-base font-bold text-gray-700 hover:text-black"
                            >
                              {{ submenuItem.name }}
                            </p>
                            <p
                              v-if="submenuItem.content"
                              class="mt-1 text-sm text-gray-500"
                            >
                              {{ submenuItem.content }}
                            </p>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
            </template>
          </div>
          <div
            class="lg:absolute lg:flex lg:items-center lg:justify-end lg:inset-y-0 lg:right-0"
          >
            <a
              href="mailto:hello@fiction.com"
              class="inline-flex items-center border border-gray-300 text-base font-medium rounded-md text-white hover:bg-gray-900"
            >
              <ElemButton class="px-4 py-2 focus:ring-opacity-0">
                <template #default>Get in Touch <ElemHoverArrow /></template>
              </ElemButton>
            </a>
          </div>
        </nav>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { resetUi, onResetUi } from "@factor/api"
import ElemButton from "@factor/ui/ElemButton.vue"
import { ref } from "vue"

import ElemHoverArrow from "./ElemHoverArrow.vue"
import ElemLogo from "./ElemLogo.vue"

export default {
  components: {
    ElemButton,
    ElemLogo,
    ElemHoverArrow,
  },
  setup() {
    /* Nav visibility */
    const vis = ref(false)

    onResetUi(() => (vis.value = false))

    const toggleVisibility = (): void => {
      if (!vis.value) {
        resetUi()
        vis.value = true
      } else {
        vis.value = false
      }
    }

    /* Dropdown item visibility */
    const toggleVisibilityDropdown = (item: any): void => {
      onResetUi(() => (item.visDropdown = false))

      if (!item.visDropdown) {
        resetUi()
        item.visDropdown = true
      } else {
        item.visDropdown = false
      }
    }

    const siteNav = ref([
      //{ path: "/companies", name: "Companies" },
      //{ path: "/about", name: "About" },
      // {
      //   path: "",
      //   name: "More",
      //   submenu: [
      //     {
      //       icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>`,
      //       path: "/thoughts",
      //       name: "Thoughts",
      //       content: "A writing collection of business and tech.",
      //     },
      //     {
      //       icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>`,
      //       path: "/finders",
      //       name: "Finders",
      //       content: "Join our global network, introduce us and earn.",
      //     },
      //     {
      //       icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>`,
      //       path: "/",
      //       name: "Newsletter",
      //       content: "Keep up to date with our thinking and learning.",
      //     },
      //   ],
      // },
    ])

    return {
      siteNav,
      vis,
      toggleVisibility,
      toggleVisibilityDropdown,
    }
  },
}
</script>
