<template>
  <div>
    <div class="w-full max-w-screen-xl mx-auto">
      <div class="lg:flex">
        <!-- <DocSearch class="lg:hidden" /> -->
        <div
          class="flex items-center justify-center px-4 sm:px-6 xl:px-8 lg:hidden"
        >
          <button
            id="main-menu"
            type="button"
            class="rounded-md -mr-2 p-2 inline-flex items-center justify-center text-primary-500 font-semibold hover:text-primary-500 hover:bg-primary-100 focus:text-primary-500 focus:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            aria-haspopup="true"
            aria-expanded="true"
            @click.stop="toggleDocsNav()"
          >
            Document Menu
            <span class="sr-only">Open docs menu</span>
            <!-- Heroicon name: menu -->
            <svg
              class="h-6 w-6 ml-2"
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
        <div
          id="sidebar"
          class="fixed z-10 inset-0 flex-none h-full bg-opacity-25 w-full lg:static lg:h-auto lg:overflow-y-visible lg:pt-0 lg:w-60 xl:w-72 lg:block"
          :class="
            vis ? 'block h-screen absolute top-16 z-50 lg:hidden p-2' : 'hidden'
          "
        >
          <DocSearch v-if="search" class="hidden lg:block lg:pt-8" />
          <div
            id="navWrapper"
            class="rounded-lg shadow-xl ring-1 ring-black ring-opacity-20 bg-white overflow-y-auto scrolling-touch overflow-hidden lg:shadow-none lg:ring-0 lg:h-auto lg:block lg:sticky lg:bg-transparent lg:top-16"
          >
            <div
              class="hidden lg:block h-12 pointer-events-none absolute inset-x-0 z-10 bg-gradient-to-b from-white"
            />
            <div
              class="absolute right-2 top-2 px-5 pt-4 flex items-center justify-end lg:hidden z-20"
            >
              <div class="-mr-3">
                <ElemButton btn="default" @click="vis = !vis">
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
            <nav
              id="nav"
              class="px-1 pt-6 overflow-y-auto font-normal text-base sm:px-3 xl:px-5 lg:text-sm pb-10 lg:pt-10 lg:pb-14 sticky text-center"
            >
              <ul class="inline-block">
                <template v-for="(group, i) in groups" :key="i">
                  <li v-if="group.title" class="mt-6">
                    <router-link
                      class="px-3 mb-2 font-medium text-base flex items-center hover:text-primary-500"
                      :to="group.path"
                      :class="isCurrentNav(i) ? 'text-primary-500' : ''"
                    >
                      <div
                        v-if="group.icon"
                        class="mr-3 w-4 h-4 rounded-md overflow-hidden"
                        v-html="group.icon"
                      />
                      <span class="title">{{ group.title }}</span>
                    </router-link>
                    <ul class="group-items">
                      <li v-for="(docId, ii) in group.menu" :key="ii">
                        <router-link
                          class="flex items-center px-3 py-1 hover:text-primary-500"
                          :to="docRoute(docId)"
                          :class="
                            isCurrentNav(docId)
                              ? 'text-primary-500'
                              : 'text-color-600'
                          "
                        >
                          <div class="mr-3 w-4 h-4" />
                          <span class="title">{{ docTitle(docId) }}</span>
                        </router-link>
                      </li>
                    </ul>
                  </li>
                  <template v-else>
                    <li v-for="(docId, ii) in group.menu" :key="ii">
                      <a
                        class="flex items-center px-3 py-2 transition-colors duration-200 text-slate-500 hover:text-primary-500"
                        :href="docRoute(docId)"
                      >
                        {{ docTitle(docId) }}
                      </a>
                    </li>
                  </template>
                </template>
              </ul>
            </nav>
          </div>
        </div>

        <div
          id="content-wrapper"
          class="min-w-0 w-full flex-auto lg:static lg:max-h-full lg:overflow-visible"
        >
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  toLabel,
  resetUi,
  onResetUi,
  camelToKebab,
  camelize,
} from "@factor/api"
import ElemButton from "@factor/ui/ElemButton.vue"
import { ref } from "vue"

import { docs, groups } from "../map"
import DocSearch from "./DocSearch.vue"
import { useRouter } from "vue-router"
export default {
  components: {
    ElemButton,
    DocSearch,
  },
  setup() {
    const baseRoute = ref("/docs")
    const router = useRouter()
    const vis = ref(false)
    const search = ref(false)

    onResetUi(() => (vis.value = false))

    const toggleDocsNav = (): void => {
      if (!vis.value) {
        resetUi()
        vis.value = true
      } else {
        vis.value = false
      }
    }

    const docRoute = (docId?: string): string => {
      return docId ? `${baseRoute.value}/${camelToKebab(docId)}` : ""
    }

    const docTitle = (docId: keyof typeof docs): string => {
      const doc = docs[docId] ?? {}
      return doc.title || toLabel(docId)
    }

    const isCurrentNav = (docId: string): boolean => {
      const route = router.currentRoute.value
      const slug = route.params.slug as string | undefined
      const routeDocId = camelize(slug || "docs")

      return routeDocId == docId
    }

    return {
      vis,
      toggleDocsNav,
      docRoute,
      docTitle,
      isCurrentNav,
      groups,
      search,
      toLabel,
    }
  },
}
</script>
