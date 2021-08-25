<template>
  <header>
    <div class="bg-primary-500 text-xs text-center font-semibold py-3">
      <div class="px-8 m-auto max-w-7xl flex justify-between text-white">
        <a
          class="hover:opacity-80 flex items-center"
          href="https://www.darwin.so"
          ><svg
            class="w-4 h-4 mr-1"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M56.0101 115.283H121.647C126.549 115.283 129.44 113.417 131.357 111.052C133.827 107.756 135.137 103.68 135.068 99.5013C135.115 94.8039 133.677 90.8143 131.558 88.2404C129.687 86.0043 126.641 83.913 120.874 83.913H46.6555C43.1146 83.913 40.0995 82.8996 38.1513 82.0952C36.0967 81.2215 34.1202 80.161 32.2447 78.9261C28.5179 76.4653 25.0552 73.5961 21.916 70.3678C18.499 66.9298 15.5025 63.0666 12.9943 58.8657C10.6286 54.7957 8 48.8917 8 42.087V26H120.874C139.738 26 157.829 33.7964 171.168 47.6741C184.506 61.5518 192 80.374 192 100C192 119.626 184.506 138.448 171.168 152.326C157.829 166.204 139.738 174 120.874 174H94.5882C81.7856 174 72.0134 164.991 66.6945 158.267C63.7159 154.519 61.2209 150.381 59.2726 145.96C57.1739 141.371 56.0355 136.37 55.9328 131.289L56.0101 115.283ZM32.0592 58.1739C37.239 63.6435 43.4239 67.8261 46.6555 67.8261H120.874C161.076 67.8261 159.529 131.37 121.647 131.37H71.395V131.482C71.4104 135.842 74.1008 142.116 78.1674 147.457C82.5741 153.232 88.5889 157.913 94.5882 157.913H120.874C135.637 157.913 149.795 151.812 160.234 140.951C170.673 130.09 176.538 115.359 176.538 100C176.538 84.6405 170.673 69.9101 160.234 59.0493C149.795 48.1885 135.637 42.087 120.874 42.087H23.4622C23.4622 47.0739 27.3277 53.1709 32.0592 58.1739Z"
              fill="currentColor"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M39.5414 110.779C33.3875 100.13 28.8725 86.6488 28.8725 75.8705H44.3347C44.3347 82.7879 47.5508 93.4374 52.7925 102.494C54.9526 106.403 57.6804 109.941 60.8792 112.983C63.6779 115.477 65.6725 116.088 66.7549 116.088V132.175C60.5081 132.175 55.05 128.957 50.8133 125.177C46.3559 121.02 42.5524 116.162 39.5414 110.779Z"
              fill="currentColor"
            />
          </svg>
          <span class="">Built by Darwin</span></a
        >
        <a class="hover:opacity-80" href="https://www.darwin.so"
          >Start optimizing your site &rarr;</a
        >
      </div>
    </div>
    <div class="relative bg-white">
      <div
        class="
          flex
          justify-between
          items-center
          max-w-7xl
          mx-auto
          px-4
          py-6
          sm:px-6
          md:justify-start md:space-x-10
          lg:px-8
        "
      >
        <div class="flex justify-start lg:w-0 lg:flex-1">
          <router-link to="/">
            <span class="sr-only">FactorES Framework</span>
            <ElemLogo class="h-6 w-auto sm:h-6"></ElemLogo>
          </router-link>
        </div>
        <div class="-mr-2 -my-2 md:hidden">
          <button
            type="button"
            class="
              bg-white
              rounded-md
              p-2
              inline-flex
              items-center
              justify-center
              text-color-400
              hover:text-color-500 hover:bg-color-100
              focus:outline-none
              focus:ring-2
              focus:ring-inset
              focus:ring-primary-500
            "
            :aria-expanded="mobileMenu ? 'true' : 'false'"
            @click.stop="mobileMenu = true"
          >
            <span class="sr-only">Open menu</span>
            <!-- Heroicon name: outline/menu -->
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
        <nav class="hidden md:flex space-x-10">
          <template v-for="(item, i) in nav" :key="i">
            <template v-if="item.menu">
              <div class="relative" @mouseover="1" @mouseleave="1">
                <!-- Item active: "", Item inactive: "text-color-500" -->
                <button
                  type="button"
                  class="
                    group
                    bg-white
                    rounded-md
                    inline-flex
                    items-center
                    text-base
                    font-semibold
                    hover:
                    focus:outline-none
                    focus:ring-2
                    focus:ring-offset-2
                    focus:ring-primary-500
                  "
                  aria-expanded="false"
                >
                  <span>{{ item.name }}</span>
                  <!--
                Heroicon name: solid/chevron-down

                Item active: "text-gray-600", Item inactive: "text-color-400"
              -->
                  <svg
                    class="
                      text-color-400
                      ml-2
                      h-5
                      w-5
                      group-hover:text-color-500
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
                  enter-active-class="transition ease-in duration-150"
                  enter-class="opacity-0 translate-y-1"
                  enter-to-class="opacity-100 translate-y-0"
                  leave-active-class="transition ease-in duration-200"
                  leave-class="opacity-100 translate-y-0"
                  leave-to-class="opacity-0 translate-y-1"
                >
                  <div
                    class="
                      absolute
                      z-10
                      -ml-4
                      mt-3
                      transform
                      w-screen
                      max-w-md
                      lg:max-w-2xl lg:ml-0 lg:left-1/2 lg:-translate-x-1/2
                    "
                  >
                    <div
                      class="
                        rounded-lg
                        shadow-lg
                        ring-1 ring-black ring-opacity-5
                        overflow-hidden
                      "
                    >
                      <div
                        class="
                          relative
                          grid
                          gap-6
                          bg-white
                          px-5
                          py-6
                          sm:gap-8 sm:p-8
                          lg:grid-cols-2
                        "
                      >
                        <a
                          v-for="(sub, ii) in item.menu"
                          :key="ii"
                          href="#"
                          class="
                            -m-3
                            p-3
                            flex
                            items-start
                            rounded-lg
                            hover:bg-color-50
                          "
                        >
                          <div
                            class="
                              flex-shrink-0 flex
                              items-center
                              justify-center
                              h-10
                              w-10
                              rounded-md
                              bg-primary-500
                              text-white
                              sm:h-12 sm:w-12
                            "
                          >
                            <!-- Heroicon name: outline/inbox -->
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
                                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                              />
                            </svg>
                          </div>
                          <div class="ml-4">
                            <p class="font-semibold">{{ sub.name }}</p>
                            <p class="mt-1 text-sm text-color-500">
                              {{ sub.description }}
                            </p>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
            </template>
            <router-link
              v-else
              :to="item.path"
              class="font-semibold hover:text-primary-500"
              active-class="text-primary-500"
              >{{ item.name }}</router-link
            >
          </template>

          <ElemGithubStars />
        </nav>
        <div class="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
          <a
            href="#"
            class="
              ml-8
              whitespace-nowrap
              inline-flex
              items-center
              justify-center
              bg-primary-500 bg-origin-border
              px-4
              py-2
              border border-transparent
              rounded-md
              shadow-sm
              text-base
              font-semibold
              text-white
              hover:bg-primary-700
            "
          >
            Start Site or App &rarr;
          </a>
        </div>
      </div>

      <transition
        enter-active-class="duration-200 ease-out"
        enter-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="duration-100 ease-in"
        leave-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="mobileMenu"
          class="
            absolute
            z-30
            top-0
            inset-x-0
            p-2
            transition
            transform
            origin-top-right
            md:hidden
          "
        >
          <div
            class="
              rounded-lg
              shadow-lg
              ring-1 ring-black ring-opacity-5
              bg-white
              divide-y-2 divide-color-50
            "
          >
            <div class="pt-5 pb-6 px-5">
              <div class="flex items-center justify-between">
                <div>
                  <router-link to="/">
                    <span class="sr-only">FactorES Framework</span>
                    <ElemLogo class="h-6 w-auto sm:h-6"></ElemLogo>
                  </router-link>
                </div>
                <div class="-mr-2">
                  <button
                    type="button"
                    class="
                      bg-white
                      rounded-md
                      p-2
                      inline-flex
                      items-center
                      justify-center
                      text-color-400
                      hover:text-color-500 hover:bg-color-100
                      focus:outline-none
                      focus:ring-2
                      focus:ring-inset
                      focus:ring-primary-500
                    "
                    @click="mobileMenu = false"
                  >
                    <span class="sr-only">Close menu</span>
                    <!-- Heroicon name: outline/x -->
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
                  </button>
                </div>
              </div>
            </div>
            <div class="py-6 px-5">
              <div class="grid grid-cols-1 gap-4">
                <router-link
                  v-for="(item, i) in nav"
                  :key="i"
                  :to="item.path"
                  class="font-semibold hover:text-primary-500"
                  active-class="text-primary-500"
                  >{{ item.name }}</router-link
                >
              </div>
              <div class="mt-6">
                <a
                  href="#"
                  class="
                    w-full
                    flex
                    items-center
                    justify-center
                    bg-primary-500 bg-origin-border
                    px-4
                    py-2
                    border border-transparent
                    rounded-md
                    shadow-sm
                    text-base
                    font-semibold
                    text-white
                    hover:bg-primary-700
                  "
                >
                  Start Site or App
                </a>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </header>
</template>
<script lang="ts">
import ElemLogo from "./ElemLogo.vue"
import ElemGithubStars from "./ElemGithubStars.vue"
import { ref } from "vue"
import { onResetUi } from "@factor/api"
export default {
  components: { ElemLogo, ElemGithubStars },
  setup() {
    const mobileMenu = ref(false)
    onResetUi(() => (mobileMenu.value = false))
    const nav = ref([
      { path: "/plugins", name: "Plugins" },
      { path: "/docs", name: "Docs" },
      { path: "/showcase", name: "Showcase" },
    ])
    return { nav, mobileMenu }
  },
}
</script>
