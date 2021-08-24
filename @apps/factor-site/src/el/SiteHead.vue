<template>
  <header>
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
            aria-expanded="false"
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

                <!--
              'Solutions' flyout menu, show/hide based on flyout menu state.

              Entering: "transition ease-out duration-200"
                From: "opacity-0 translate-y-1"
                To: "opacity-100 translate-y-0"
              Leaving: "transition ease-in duration-150"
                From: "opacity-100 translate-y-0"
                To: "opacity-0 translate-y-1"
            -->
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
            Start &rarr;
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
                  <img
                    class="h-8 w-auto"
                    src="https://tailwindui.com/img/logos/workflow-mark-purple-600-to-primary-600.svg"
                    alt="Workflow"
                  />
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
              <div class="mt-6">
                <nav class="grid grid-cols-1 gap-7">
                  <a
                    href="#"
                    class="
                      -m-3
                      p-3
                      flex
                      items-center
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
                    <div class="ml-4 font-semibold">Inbox</div>
                  </a>

                  <a
                    href="#"
                    class="
                      -m-3
                      p-3
                      flex
                      items-center
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
                      "
                    >
                      <!-- Heroicon name: outline/annotation -->
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
                          d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                        />
                      </svg>
                    </div>
                    <div class="ml-4 font-semibold">Messaging</div>
                  </a>

                  <a
                    href="#"
                    class="
                      -m-3
                      p-3
                      flex
                      items-center
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
                      "
                    >
                      <!-- Heroicon name: outline/chat-alt-2 -->
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
                          d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                        />
                      </svg>
                    </div>
                    <div class="ml-4 font-semibold">Live Chat</div>
                  </a>
                </nav>
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
                  Start
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
export default {
  components: { ElemLogo, ElemGithubStars },
  setup() {
    const nav = ref([
      { path: "/plugins", name: "Plugins" },
      { path: "/docs", name: "Docs" },
      { path: "/showcase", name: "Showcase" },
    ])
    return { nav }
  },
}
</script>
