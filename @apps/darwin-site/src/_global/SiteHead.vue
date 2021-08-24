<template>
  <header
    class="w-full overflow-y-visible z-30"
    :class="darkMode ? 'absolute' : 'fixed bg-white'"
  >
    <div
      class="max-w-7xl mx-auto py-2 lg:py-6 rounded-md"
      :class="scrolled ? 'shadow-sm  ring-1 ring-black ring-opacity-5' : ''"
    >
      <div class="px-4 lg:px-6">
        <nav
          class="
            relative
            flex
            items-center
            justify-between
            sm:h-10
            lg:justify-center
          "
          aria-label="Global"
        >
          <div
            class="
              flex
              items-center
              flex-1
              lg:flex-none lg:absolute lg:inset-y-0 lg:left-0
            "
          >
            <div class="flex items-center justify-between w-full lg:w-auto">
              <router-link
                to="/"
                class="transition-opacity hidden lg:block hover:opacity-80"
                :class="hideLogo ? 'opacity-0' : ' '"
              >
                <ElemLogo
                  :class="darkMode ? 'scheme-light' : 'scheme-standard'"
                  mode="logo"
                  class="h-6 w-auto"
                />
              </router-link>
              <button
                id="main-menu"
                type="button"
                class="
                  rounded-md
                  p-2
                  inline-flex
                  items-center
                  justify-start
                  focus:outline-none
                  focus:ring-2
                  focus:ring-inset
                  focus:ring-primary-500
                  lg:hidden
                  w-32
                "
                :class="
                  darkMode
                    ? 'text-primary-300 hover:text-white focus:text-white focus:bg-transparent'
                    : 'text-bluegray-500 hover:text-primary-500 focus:text-primary-500 focus:bg-transparent'
                "
                aria-haspopup="true"
                aria-expanded="true"
                @click.stop="toggleVisibility()"
              >
                <span class="sr-only">Open main menu</span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 8h16M4 16h16"
                  />
                </svg>
              </button>
              <div class="logo-area block lg:hidden text-center">
                <router-link to="/">
                  <ElemLogo
                    :class="darkMode ? 'scheme-light' : 'scheme-standard'"
                    mode="icon"
                    class="h-6 w-auto"
                  />
                </router-link>
              </div>
              <a
                :href="getDashboardUrl('/login')"
                class="
                  w-32
                  text-sm
                  inline-flex
                  font-medium
                  justify-end
                  lg:hidden
                "
                :class="
                  darkMode
                    ? 'text-primary-300 hover:text-white'
                    : 'text-bluegray-500 hover:text-primary-500'
                "
              >
                <ElemAvatar
                  v-if="activeUser"
                  class="w-8 h-8 rounded-full ml-3"
                  :email="activeUser.email"
                />
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </a>
            </div>
          </div>
          <div class="hidden lg:flex space-x-5 items-center">
            <template v-for="(navItem, i) in siteNav" :key="i">
              <router-link
                v-if="navItem.submenu == null"
                :to="navItem.path"
                class="text-lg px-3 py-1 rounded-md"
                :class="[
                  darkMode
                    ? 'text-white hover:opacity-50'
                    : `text-bluegray-800 hover:text-primary-500`,
                ]"
                exact-active-class="bg-bluegray-50"
              >
                <span>{{ navItem.name }}</span>
              </router-link>
              <div
                v-else
                class="relative"
                @mouseover="showDropdown(navItem)"
                @mouseleave="hideDropdown(navItem)"
                @click="router.push(navItem.submenu[0].path)"
              >
                <button
                  type="button"
                  class="
                    text-lg
                    group
                    rounded-md
                    inline-flex
                    items-center
                    px-2
                    py-7
                    focus:outline-none
                  "
                  :class="[
                    navItem.visDropdown ? 'opacity-100' : '',
                    darkMode
                      ? 'text-white hover:opacity-50'
                      : 'text-bluegray-800 hover:text-primary-500',
                  ]"
                >
                  <span>{{ navItem.name }}</span>
                  <span
                    v-html="navItem.icon"
                    class="ml-1 w-4 h-4 transition-all"
                    :class="navItem.visDropdown ? 'rotate-180' : 'rotate-0'"
                  />
                </button>

                <transition
                  enter-active-class="transition ease-in duration-150"
                  enter-class="opacity-0 translate-y-1"
                  enter-to-class="opacity-100 translate-y-0"
                  leave-active-class="transition ease-in duration-200"
                  leave-class="opacity-100 translate-y-0"
                  leave-to-class="opacity-0 translate-y-1"
                >
                  <div
                    v-show="navItem.visDropdown"
                    class="
                      absolute
                      z-50
                      left-1/2
                      transform
                      -translate-x-1/2
                      px-2
                      sm:px-0
                      text-bluegray-900
                    "
                    :class="navItem.submenuGrid ? 'w-screen max-w-xl' : 'w-64'"
                  >
                    <div
                      class="
                        rounded-lg
                        shadow-2xl
                        ring-1 ring-primary-500 ring-opacity-5
                        overflow-hidden
                      "
                    >
                      <!-- submenu triangle -->
                      <div
                        class="
                          absolute
                          transform
                          rotate-45
                          w-5
                          h-5
                          -top-2
                          -ml-2.5
                          rounded
                          shadow
                          ring-1 ring-primary-500 ring-opacity-5
                          bg-white
                          inset-x-2/4
                        "
                      />
                      <!-- submenu grid -->
                      <div
                        v-if="navItem.submenuGrid"
                        class="
                          relative
                          grid
                          gap-6
                          bg-white
                          px-5
                          py-6
                          sm:gap-x-14 sm:gap-y-10 sm:p-8
                          lg:grid-cols-2
                        "
                      >
                        <a
                          v-for="(submenuItem, ii) in navItem.submenu"
                          :key="ii"
                          :href="submenuItem.path"
                          class="
                            -m-3
                            p-3
                            flex
                            transition-colors
                            group
                            rounded-md
                            hover:bg-bluegray-50
                          "
                        >
                          <div
                            class="w-6 h-6"
                            :class="submenuItem.class"
                            v-html="submenuItem.icon"
                          />

                          <p class="ml-4">
                            <span
                              class="
                                block
                                font-semibold
                                leading-5
                                tracking-wide
                                mb-1
                              "
                            >
                              {{ submenuItem.name }}
                            </span>
                            <span
                              v-if="submenuItem.tagline"
                              class="
                                block
                                text-base
                                leading-5
                                text-bluegray-400
                              "
                            >
                              {{ submenuItem.tagline }}
                            </span>
                          </p>
                        </a>
                      </div>
                      <!-- submenu list -->
                      <div v-else class="relative bg-white px-5 py-6 sm:p-8">
                        <template
                          v-for="(submenuItem, ii) in navItem.submenu"
                          :key="ii"
                        >
                          <a
                            v-if="submenuItem.path"
                            :href="submenuItem.path"
                            class="block py-2 hover:text-primary-500"
                          >
                            {{ submenuItem.name }}
                          </a>
                          <div
                            v-else
                            class="
                              text-xs
                              uppercase
                              tracking-wider
                              pt-4
                              text-bluegray-300
                              font-semibold
                            "
                          >
                            {{ submenuItem.heading }}
                          </div>
                        </template>
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
            </template>
          </div>
          <ul
            class="
              hidden
              lg:absolute
              lg:flex
              lg:items-center
              lg:justify-end
              lg:inset-y-0
              lg:right-0
            "
          >
            <li class="ml-6">
              <a
                :href="getDashboardUrl('/login')"
                class="flex items-center text-lg hover:text-primary-800"
                :class="
                  darkMode
                    ? 'text-white hover:opacity-50'
                    : 'text-primary-500 hover:text-primary-800'
                "
              >
                <span v-if="activeUser" class="inline-flex items-center">
                  <span>View Dashboard</span>
                  <ElemAvatar
                    class="w-8 h-8 rounded-full ml-3"
                    :email="activeUser.email"
                  />
                </span>
                <span v-else>Sign In &rarr;</span></a
              >
            </li>
          </ul>
        </nav>
      </div>

      <!-- Mobile Nav -->

      <div class="relative z-40 lg:hidden">
        <div class="fixed inset-0 flex z-40 pointer-events-none">
          <transition
            name="enterVeil"
            enter-active-class="transition-opacity ease-linear "
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition-opacity ease-linear "
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <div
              v-show="vis"
              class="fixed inset-0 pointer-events-auto"
              aria-hidden="true"
            >
              <div class="absolute inset-0 bg-bluegray-500 opacity-75" />
            </div>
          </transition>

          <transition
            enter-active-class="transition ease-in-out transform"
            enter-from-class="-translate-x-full"
            enter-to-class="translate-x-0"
            leave-active-class="transition ease-in-out transform"
            leave-from-class="translate-x-0"
            leave-to-class="-translate-x-full"
          >
            <div
              v-show="vis"
              class="
                relative
                flex-1 flex flex-col
                max-w-xs
                w-full
                pointer-events-auto
              "
              :class="darkMode ? 'bg-primary-900' : 'bg-white'"
            >
              <div
                class="absolute top-0 right-0 -mr-12 pt-2 transition-opacity"
                :class="afterVisible ? 'opacity-100' : 'opacity-0'"
              >
                <button
                  class="
                    ml-1
                    flex
                    items-center
                    justify-center
                    h-10
                    w-10
                    rounded-full
                    focus:outline-none
                    focus:ring-2
                    focus:ring-inset
                    focus:ring-white
                  "
                >
                  <span class="sr-only">Close sidebar</span>
                  <!-- Heroicon name: x -->
                  <svg
                    class="h-6 w-6 text-white"
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
                </button>
              </div>

              <div
                class="
                  flex-shrink-0 flex
                  justify-between
                  items-center
                  px-5
                  py-3
                  h-14
                  border-b
                "
                :class="darkMode ? 'border-gray-700' : 'border-gray-100'"
              >
                <div>
                  <router-link
                    to="/"
                    class="
                      group
                      block
                      w-full
                      text-center text-bluegray-500
                      hover:text-primary-500
                      focus:outline-none
                    "
                  >
                    <div class="flex justify-center">
                      <ElemLogo
                        :class="darkMode ? 'scheme-light' : 'scheme-standard'"
                        mode="icon"
                        class="h-6 w-auto"
                      />
                    </div>
                  </router-link>
                </div>
                <!-- <div class="ml-8 max-w-full overflow-x-hidden">
                  Darwin Analytics
                </div> -->
              </div>

              <div class="p-5 h-full overflow-y-scroll">
                <div
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="main-menu"
                >
                  <template v-for="(navItem, iii) in siteNav" :key="iii">
                    <!-- {{ navItem.icon }} -->
                    <router-link
                      v-if="navItem.submenu == null && navItem.path"
                      :key="navItem.path"
                      :to="navItem.path"
                      class="block px-3 py-2 rounded-md text-sm font-medium"
                      :class="
                        darkMode
                          ? 'text-primary-200 hover:text-white hover:bg-primary-200 hover:bg-opacity-10'
                          : 'hover:bg-bluegray-100 hover:text-primary-500'
                      "
                      role="menuitem"
                    >
                      {{ navItem.name }}
                    </router-link>
                    <template v-else>
                      <a
                        v-for="(submenuItem, ii) in navItem.submenu"
                        :key="ii"
                        :href="submenuItem.path"
                        role="menuitem"
                        class="
                          flex
                          items-center
                          px-3
                          py-2
                          rounded-md
                          text-sm
                          font-medium
                          group
                        "
                        :class="
                          darkMode
                            ? 'text-primary-200 hover:text-white hover:bg-primary-200 hover:bg-opacity-10'
                            : 'hover:bg-bluegray-100 hover:text-primary-500'
                        "
                      >
                        <div
                          class="w-6 h-6 mr-2"
                          :class="
                            darkMode
                              ? 'text-primary-400 group-hover:text-primary-200'
                              : 'text-bluegray-500 group-hover:text-primary-500'
                          "
                          v-html="submenuItem.icon"
                        />

                        <span>{{ submenuItem.name }}</span>
                      </a>
                    </template>
                  </template>
                </div>
                <ElemButton
                  :btn="darkMode ? 'outlineWhite' : 'primary'"
                  class="mt-6 mb-14 sm:text-base"
                  :href="getDashboardUrl('/login')"
                >
                  Sign In &rarr;
                </ElemButton>
              </div>
              <div
                class="flex items-center justify-between p-4 transition-opacity"
              >
                <ul class="m-0 px-3 py-0 flex">
                  <li
                    v-for="(item, i) in socialList"
                    :key="i"
                    class="text-center lg:text-left"
                  >
                    <a
                      :href="item.path"
                      class="inline-block mx-2"
                      :target="item.target ? item.target : '_self'"
                    >
                      <span class="sr-only">{{ item.name }}</span>
                      <div
                        :class="
                          darkMode
                            ? 'text-primary-300 hover:text-white'
                            : 'text-bluegray-500 hover:text-primary-500'
                        "
                        v-html="item.icon"
                      />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </transition>
          <div class="flex-shrink-0 w-14" aria-hidden="true">
            <!-- Dummy element to force sidebar to shrink to fit close icon -->
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
<script lang="ts">
import {
  resetUi,
  onResetUi,
  isDev,
  emitEvent,
  onBrowserEvent,
  stored,
  activeUser,
} from "@factor/api"
import ElemButton from "../el/ElemButton.vue"
import { ref, computed, watch } from "vue"
import ElemAvatar from "@factor/ui/ElemAvatar.vue"
import ElemLogo from "./DarwinLogo.vue"
import { featuresList, socialList } from "../map"
import { getDashboardUrl } from "../util"
import { useRouter } from "vue-router"
export default {
  components: {
    ElemButton,
    ElemLogo,
    ElemAvatar,
  },
  setup() {
    const darkMode = computed(() => stored("pageMode") == "dark")
    /* Nav visibility */
    const vis = ref(false)
    const afterVisible = ref(false)
    const router = useRouter()
    const scrolled = ref(false)

    onBrowserEvent("scroll", () => {
      scrolled.value = window.pageYOffset > 50
    })

    const hideLogo = computed(() => {
      const r = router.currentRoute.value
      if (!scrolled.value && r.path == "/") {
        return true
      } else {
        return false
      }
    })

    onResetUi(() => (vis.value = false))

    const toggleVisibility = (): void => {
      if (!vis.value) {
        resetUi()
        vis.value = true
      } else {
        vis.value = false
      }
    }

    const showDropdown = (item: any): void => {
      resetUi()
      item.visDropdown = true
    }

    const hideDropdown = (item: any): void => {
      resetUi()
      item.visDropdown = false
    }

    const submenu = computed(() => {
      return Object.values(featuresList).filter((_) => _.path)
    })

    const siteNav = ref([
      {
        path: "",
        name: "Features",
        icon: `<svg xmlns="http://www.w3.org/2000/svg"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
</svg>`,
        submenuGrid: true,
        submenu,
      },
      { path: "/about", name: "About Us" },
      { path: "/docs", name: "Docs" },
      { path: "/support", name: "Contact" },
    ])

    watch(
      () => vis.value,
      (vis) => {
        if (vis) {
          setTimeout(() => {
            afterVisible.value = true
          }, 300)
        } else {
          afterVisible.value = false
        }
      },
    )

    return {
      isDev,
      emitEvent,
      getDashboardUrl,
      siteNav,
      socialList,
      vis,
      afterVisible,
      toggleVisibility,
      showDropdown,
      hideDropdown,
      hideLogo,
      router,
      darkMode,
      scrolled,
      activeUser,
    }
  },
}
</script>
