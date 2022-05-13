<template>
  <header>
    <div class="bg-primary-500 py-3 text-center text-xs font-semibold">
      <div
        class="m-auto flex max-w-7xl justify-between space-x-4 px-8 text-white"
      >
        <a
          class="flex items-center hover:opacity-80"
          href="https://www.kaption.co"
          ><svg
            class="mr-1 h-4 w-4"
            viewBox="0 0 1200 750"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g class="kaption-arrows">
              <path
                d="M282.613 716.397C275.611 721.41 266.91 723.449 258.409 722.069C249.909 720.688 242.301 716 237.245 709.028L8.86525 392.263C3.74924 384.42 1.02515 375.258 1.02515 365.895C1.02515 356.531 3.74924 347.369 8.86525 339.527L237.245 22.7227C242.312 15.7632 249.926 11.0904 258.426 9.72442C266.925 8.35841 275.62 10.41 282.613 15.4313L348.542 62.9597C355.514 68.0151 360.202 75.6238 361.582 84.1241C362.963 92.6244 360.924 101.326 355.91 108.328L189.216 339.488C172.589 368.152 172.589 368.151 189.216 392.224L355.91 623.462C360.924 630.464 362.963 639.165 361.582 647.665C360.202 656.166 355.514 663.774 348.542 668.83L282.613 716.397Z"
                fill="currentColor"
                stroke-miterlimit="10"
              />
              <path
                d="M732.313 716.397C725.311 721.41 716.61 723.449 708.11 722.069C699.61 720.688 692.001 716 686.946 709.028L458.566 392.263C453.45 384.42 450.726 375.258 450.726 365.895C450.726 356.531 453.45 347.369 458.566 339.527L686.946 22.7227C692.013 15.7632 699.627 11.0904 708.126 9.72442C716.626 8.35841 725.321 10.41 732.313 15.4313L798.242 62.9597C805.214 68.0151 809.902 75.6238 811.283 84.1241C812.663 92.6244 810.624 101.326 805.611 108.328L638.878 339.488C622.251 368.152 622.251 368.151 638.878 392.224L805.572 623.462C810.586 630.464 812.625 639.165 811.244 647.665C809.863 656.166 805.175 663.774 798.204 668.83L732.313 716.397Z"
                fill="currentColor"
                stroke-miterlimit="10"
              />
              <path
                d="M1182.01 716.397C1175 721.446 1166.28 723.507 1157.75 722.125C1149.22 720.744 1141.59 716.033 1136.53 709.028L908.15 392.263C903.034 384.42 900.31 375.258 900.31 365.895C900.31 356.531 903.034 347.369 908.15 339.527L1136.53 22.7227C1141.6 15.73 1149.24 11.0347 1157.76 9.66768C1166.29 8.30064 1175.01 10.3736 1182.01 15.4313L1247.94 62.9597C1254.91 68.0151 1259.6 75.6238 1260.98 84.1241C1262.36 92.6244 1260.32 101.326 1255.31 108.327L1088.58 339.488C1071.99 368.151 1071.99 368.151 1088.58 392.224L1255.31 623.462C1260.32 630.464 1262.36 639.165 1260.98 647.665C1259.6 656.166 1254.91 663.774 1247.94 668.83L1182.01 716.397Z"
                fill="currentColor"
                stroke-miterlimit="10"
              />
            </g>
          </svg>
          <span class="">Built by Kaption.co</span></a
        >
        <a class="hover:opacity-80" href="https://www.kaption.co"
          >CX Analytics and Feedback Tools &rarr;</a
        >
      </div>
    </div>
    <div class="relative">
      <div
        class="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 sm:px-6 md:justify-start md:space-x-10 lg:px-8"
      >
        <div class="flex justify-start lg:w-0 lg:flex-1">
          <router-link to="/">
            <span class="sr-only">FactorJS Framework</span>
            <ElemLogo class="h-6 w-auto sm:h-6"></ElemLogo>
          </router-link>
        </div>
        <div class="-my-2 -mr-2 md:hidden">
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-md bg-white p-2 text-slate-400 hover:bg-color-100 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
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
        <div class="hidden space-x-10 md:flex">
          <template v-for="item in nav" :key="item.name">
            <template v-if="item.menu">
              <div class="relative" @mouseover="1" @mouseleave="1">
                <!-- Item active: "", Item inactive: "text-slate-500" -->
                <button
                  type="button"
                  class="group hover: inline-flex items-center rounded-md bg-white text-base font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  aria-expanded="false"
                >
                  <span>{{ item.name }}</span>
                  <!--
                Heroicon name: solid/chevron-down

                Item active: "text-slate-600", Item inactive: "text-slate-400"
              -->
                  <svg
                    class="ml-2 h-5 w-5 text-slate-400 group-hover:text-slate-500"
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
                    class="absolute z-10 -ml-4 mt-3 w-screen max-w-md lg:left-1/2 lg:ml-0 lg:max-w-2xl lg:-translate-x-1/2"
                  >
                    <div
                      class="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5"
                    >
                      <div
                        class="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8 lg:grid-cols-2"
                      >
                        <a
                          v-for="(sub, ii) in item.menu"
                          :key="ii"
                          href="#"
                          class="-m-3 flex items-start rounded-lg p-3 hover:bg-color-50"
                        >
                          <div
                            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary-500 text-white sm:h-12 sm:w-12"
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
                            <p class="mt-1 text-sm text-slate-500">
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
        </div>
        <div class="hidden items-center justify-end md:flex md:flex-1 lg:w-0">
          <router-link
            to="/docs"
            class="ml-8 inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-primary-500 bg-origin-border px-4 py-2 text-base font-semibold text-white shadow-sm hover:bg-primary-700"
          >
            Start Site or App &rarr;
          </router-link>
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
          class="absolute inset-x-0 top-0 z-30 origin-top-right p-2 transition md:hidden"
        >
          <div
            class="divide-y-2 divide-color-50 rounded-lg bg-white shadow-lg ring-1 ring-black/5"
          >
            <div class="px-5 pt-5 pb-6">
              <div class="flex items-center justify-between">
                <div>
                  <router-link to="/">
                    <span class="sr-only">FactorJS Framework</span>
                    <ElemLogo class="h-6 w-auto sm:h-6"></ElemLogo>
                  </router-link>
                </div>
                <div class="-mr-2">
                  <button
                    type="button"
                    class="inline-flex items-center justify-center rounded-md bg-white p-2 text-slate-400 hover:bg-color-100 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
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

              <ElemGithubStars class="my-8" />
              <div class="mt-6">
                <a
                  href="#"
                  class="flex w-full items-center justify-center rounded-md border border-transparent bg-primary-500 bg-origin-border px-4 py-2 text-base font-semibold text-white shadow-sm hover:bg-primary-700"
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
<script lang="ts" setup>
import { ref } from "vue"
import { onResetUi } from "@factor/api"
import ElemLogo from "./ElLogo.vue"
import ElemGithubStars from "./ElGithubStars.vue"
const mobileMenu = ref(false)
onResetUi(() => (mobileMenu.value = false))

const nav = ref<
  {
    path: string
    name: string
    menu?: { name: string; description: string }[]
  }[]
>([
  { path: "/plugins", name: "Plugins", menu: undefined },
  { path: "/docs", name: "Docs", menu: undefined },
  { path: "/showcase", name: "Showcase", menu: undefined },
])
</script>
