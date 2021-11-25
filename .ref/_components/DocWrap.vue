<template>
  <div>
    <div class="w-full max-w-screen mx-auto">
      <div class="lg:flex my-8">
        <!-- <DocSearch class="lg:hidden" /> -->
        <div
          class="flex items-center justify-end px-4 sm:px-6 xl:px-8 lg:hidden"
        >
          <button
            id="main-menu"
            type="button"
            class="
              rounded-md
              -mr-2
              p-2
              inline-flex
              items-center
              justify-center
              text-color-500
              hover:text-primary-500 hover:bg-primary-100
              focus:text-primary-500
              focus:bg-primary-100
              focus:outline-none
              focus:ring-2
              focus:ring-inset
              focus:ring-primary-500
            "
            aria-haspopup="true"
            aria-expanded="true"
            @click.stop="toggleDocsNav()"
          >
            Documents
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
          class="
            fixed
            z-10
            inset-0
            flex-none
            h-full
            bg-opacity-25
            w-full
            lg:static lg:h-auto lg:overflow-y-visible lg:pt-0 lg:w-60
            xl:w-72
            lg:block
          "
          :class="
            vis ? 'block h-screen absolute top-16 z-50 lg:hidden p-2' : 'hidden'
          "
        >
          <DocSearch v-if="search" class="hidden lg:block lg:pt-8" />
          <div
            id="navWrapper"
            class="
              rounded-lg
              shadow-xl
              ring-1 ring-black ring-opacity-5
              bg-white
              overflow-y-auto
              scrolling-touch
              overflow-hidden
              lg:shadow-none
              lg:ring-0
              lg:h-auto
              lg:block
              lg:sticky
              lg:bg-transparent
              lg:top-16
            "
          >
            <div
              class="
                hidden
                lg:block
                h-12
                pointer-events-none
                absolute
                inset-x-0
                z-10
                bg-gradient-to-b
                from-white
              "
            />
            <div class="px-5 pt-4 flex items-center justify-end lg:hidden">
              <div class="-mr-3">
                <ElemButton
                  class="
                    rounded-md
                    pl-2
                    pr-2
                    inline-flex
                    items-center
                    justify-center
                    text-bluegray-500
                    bg-bluegray-50
                    hover:text-primary-500 hover:bg-primary-100
                    focus:outline-none
                    focus:ring-2
                    focus:ring-inset
                    focus:ring-primary-500
                  "
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
            <nav
              id="nav"
              class="
                px-1
                pt-6
                overflow-y-auto
                font-normal
                text-base
                sm:px-3
                xl:px-5
                lg:text-sm
                pb-10
                lg:pt-10 lg:pb-14
                sticky
              "
            >
              <ul>
                <template v-for="(group, i) in map" :key="i">
                  <li v-if="group.title" class="mt-4">
                    <router-link
                      class="
                        px-3
                        mb-2
                        font-medium
                        text-base
                        flex
                        items-center
                        hover:text-primary-500
                      "
                      :to="group.path || docRoute(group.docId)"
                      :class="
                        isCurrentNav(i)
                          ? 'text-primary-500'
                          : 'text-bluegray-800'
                      "
                    >
                      <div
                        v-if="group.icon"
                        class="mr-3 w-4 h-4 rounded-md overflow-hidden"
                        v-html="group.icon"
                      />
                      <span class="title">{{ group.title }}</span>
                    </router-link>
                    <ul class="group-items">
                      <li v-for="(page, docId) in group.pages" :key="docId">
                        <router-link
                          v-if="page.nav != false"
                          class="
                            flex
                            items-center
                            px-3
                            py-2
                            hover:text-primary-500
                          "
                          :to="
                            page.disabled ? '' : page.path || docRoute(docId)
                          "
                          :class="
                            isCurrentNav(docId)
                              ? 'text-primary-500'
                              : 'text-bluegray-500'
                          "
                        >
                          <div class="mr-3 w-4 h-4" />
                          <span class="title">{{
                            page.title || toLabel(docId)
                          }}</span>
                        </router-link>
                      </li>
                    </ul>
                  </li>
                  <template v-else>
                    <li v-for="(page, docId) in group.pages" :key="docId">
                      <a
                        class="
                          flex
                          items-center
                          px-3
                          py-2
                          transition-colors
                          duration-200
                          text-bluegray-500
                          hover:text-primary-500
                        "
                        :href="page.path || docRoute(docId)"
                      >
                        <div
                          v-if="page.icon"
                          class="mr-3 w-4 h-4 rounded-md overflow-hidden"
                          v-html="page.icon"
                        />
                        {{ page.title || toLabel(docId) }}
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
          class="
            min-w-0
            w-full
            flex-auto
            lg:static lg:max-h-full lg:overflow-visible
          "
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
import { computed, ref } from "vue"

import { docSetting } from "../helpers"
import DocSearch from "./DocSearch.vue"
import { useRouter } from "vue-router"
export default {
  components: {
    ElemButton,
    DocSearch,
  },
  setup() {
    const router = useRouter()
    const vis = ref(false)
    const map = ref(docSetting("map"))

    const search = ref(docSetting("includeSearch"))

    onResetUi(() => (vis.value = false))

    const toggleDocsNav = (): void => {
      if (!vis.value) {
        resetUi()
        vis.value = true
      } else {
        vis.value = false
      }
    }

    const settingBaseRoute = ref(docSetting("baseRoute"))

    const baseRoute = computed(() => {
      return settingBaseRoute.value ?? "/docs"
    })

    const docRoute = (doc?: string): string => {
      return doc ? `${baseRoute.value}/${camelToKebab(doc)}` : ""
    }

    const isCurrentNav = (docId: string): boolean => {
      const route = router.currentRoute.value
      const docSlug =
        (route.params.docSlug as string | undefined) ||
        Object.keys(map.value)[0]
      const routeDocId = camelize(docSlug)

      return routeDocId == docId
    }

    return {
      vis,
      toggleDocsNav,
      docRoute,
      isCurrentNav,
      map,
      search,
      toLabel,
    }
  },
}
</script>
