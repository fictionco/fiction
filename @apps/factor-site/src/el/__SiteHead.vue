<template>
  <div
    class="fixed w-full top-0 overflow-y-visible z-50 transition-all"
    :class="scrollClass"
  >
    <div class="relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <nav
          class="relative flex items-center justify-between sm:h-10 lg:justify-center"
          aria-label="Global"
        >
          <div
            class="flex items-center flex-1 lg:absolute lg:inset-y-0 lg:left-0"
          >
            <div class="flex items-center justify-between w-full lg:w-auto">
              <router-link to="/">
                <ElemLogo mode="logo" class="scheme-standard h-6 w-auto" />
              </router-link>
              <div class="-mr-2 flex items-center lg:hidden">
                <button
                  id="main-menu"
                  type="button"
                  class="rounded-md p-2 inline-flex items-center justify-center text-color-500 hover:text-primary-500 hover:bg-primary-100 focus:text-primary-500 focus:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                  aria-haspopup="true"
                  aria-expanded="true"
                  @click.stop="toggleVisibility()"
                >
                  <span class="sr-only">Open main menu</span>
                  <!-- Heroicon name: menu -->
                  <svg
                    class="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div class="hidden font-medium md:space-x-10 lg:flex lg:items-center">
            <template v-for="(navItem, i) in siteNav" :key="i">
              <a
                v-if="navItem.submenu == null"
                :href="navItem.path"
                class="text-slate-500 hover:text-primary-500"
              >
                {{ navItem.name }}
              </a>
              <div v-else class="relative">
                <button
                  type="button"
                  class="group rounded-md inline-flex items-center text-base hover:text-primary-500 focus:outline-none"
                  :class="
                    navItem.visDropdown ? 'text-primary-500' : 'text-slate-500'
                  "
                  @click.stop="toggleVisibilityDropdown(navItem)"
                >
                  <span>{{ navItem.name }}</span>
                  <svg
                    class="ml-2 h-5 w-5 group-hover:text-primary-500"
                    :class="
                      navItem.visDropdown
                        ? 'text-primary-500'
                        : 'text-slate-500'
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
                    class="absolute z-50 left-1/2 transform -translate-x-1/2 mt-3 px-2 w-screen max-w-md sm:px-0"
                  >
                    <div
                      class="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden"
                    >
                      <div
                        class="relative bg-white py-6 px-5 grid gap-6 sm:gap-8 sm:p-8"
                      >
                        <a
                          v-for="(submenuItem, ii) in navItem.submenu"
                          :key="ii"
                          :href="submenuItem.path"
                          class="-m-3 p-3 flex items-start rounded-lg hover:bg-primary-50"
                        >
                          <div class="ml-4">
                            <p class="text-base font-medium text-slate-500">
                              {{ submenuItem.name }}
                            </p>
                            <p
                              v-if="submenuItem.content"
                              class="mt-1 text-sm text-slate-500"
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
            <ElemGithubStars />
          </div>
          <div
            class="hidden lg:absolute lg:flex lg:items-center lg:justify-end lg:inset-y-0 lg:right-0"
          >
            <ElemButton
              v-if="$route.path != '/install'"
              to="/install"
              btn="primary"
              class="font-bold"
            >
              Start Your App &rarr;
            </ElemButton>
          </div>
        </nav>
      </div>

      <!-- Mobile nav -->
      <transition
        enter-active-class="transition ease-out duration-150"
        enter-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition ease-in duration-200"
        leave-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-show="vis"
          class="absolute top-0 inset-x-0 p-2 z-50 transition transform origin-top-right lg:hidden"
        >
          <div
            class="rounded-lg shadow-xl bg-white ring-1 ring-black ring-opacity-5 overflow-x-hidden"
          >
            <div class="px-5 pt-4 flex items-center justify-between">
              <div>
                <ElemLogo mode="icon" class="scheme-standard h-8 w-auto" />
              </div>
              <div class="-mr-3">
                <ElemButton
                  class="rounded-md pl-2 pr-2 inline-flex items-center justify-center text-slate-500 bg-slate-50 hover:text-primary-500 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                  @click="vis = !vis"
                >
                  <span class="sr-only">Close menu</span>
                  <!-- Heroicon name: x -->
                  <svg
                    class="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </ElemButton>
              </div>
            </div>
            <div
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="main-menu"
              class="divide-y-2 divide-slate-100"
            >
              <div class="px-2 pt-2 pb-3" role="none">
                <template v-for="(navItem, iii) in siteNav" :key="iii">
                  <a
                    v-if="navItem.submenu == null"
                    :key="navItem.path"
                    :href="navItem.path"
                    class="block px-3 py-2 rounded-md text-base font-medium text-slate-500 hover:text-primary-500 hover:bg-primary-50"
                    role="menuitem"
                  >
                    {{ navItem.name }}
                  </a>
                  <template v-else>
                    <a
                      v-for="(submenuItem, ii) in navItem.submenu"
                      :key="ii"
                      :href="submenuItem.path"
                      role="menuitem"
                      class="block px-3 py-2 rounded-md text-base font-medium text-slate-500 hover:text-primary-500 hover:bg-primary-50"
                    >
                      {{ submenuItem.name }}
                    </a>
                  </template>
                </template>
              </div>
              <div role="none" class="py-6 px-5 space-y-6">
                <ElemButton
                  v-if="$route.path != '/install'"
                  to="/install"
                  btn="primary"
                  class="w-full flex items-center justify-center px-4 py-2 font-bold"
                >
                  Start Your App &rarr;
                </ElemButton>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
<script lang="ts">
import { resetUi, onResetUi, isDev } from "@factor/api"
import ElemButton from "@factor/ui/ElemButton.vue"
import { ref, onMounted } from "vue"

import ElemLogo from "./ElemLogo.vue"
import ElemGithubStars from "./ElemGithubStars.vue"

export default {
  components: {
    ElemLogo,
    ElemGithubStars,
    ElemButton,
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

    /**
     * Toggle component class on scroll
     */
    const scrollClass = ref<string>("")

    const setScrollClass = () => {
      scrollClass.value =
        window.pageYOffset == 0 ? "px-6 py-2" : "px-4 py-1 bg-white shadow-lg"
    }

    onMounted(() => {
      window.addEventListener("scroll", setScrollClass)
    })

    const siteNav = ref([
      { path: "/themes", name: "Themes" },
      { path: "/plugins", name: "Plugins" },
      {
        path: "/docs",
        name: "Docs",
        // submenu: [
        //   {
        //     path: "/path",
        //     name: "Name",
        //     content: "Include content in your submenu item",
        //   }
        // ],
      },
    ])

    return {
      isDev,
      siteNav,
      scrollClass,
      vis,
      toggleVisibility,
      toggleVisibilityDropdown,
    }
  },
}
</script>
