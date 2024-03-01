<script lang="ts" setup>
import {
  camelToKebab,
  camelize,
  onResetUi,
  resetUi,
  toLabel,
} from '@factor/api'
import ElButton from '@factor/ui/ElButton.vue'
import { ref } from 'vue'

import { useRouter } from 'vue-router'
import type { DocKeys } from '../map'
import { docs, groups } from '../map'

const baseRoute = ref('/docs')
const router = useRouter()
const vis = ref(false)

onResetUi(() => (vis.value = false))

function toggleDocsNav(): void {
  if (vis.value) {
    vis.value = false
  }
  else {
    resetUi()
    vis.value = true
  }
}

function docRoute(docId?: string): string {
  return docId ? `${baseRoute.value}/${camelToKebab(docId)}` : ''
}

function docTitle(docId: DocKeys): string {
  const doc = docs.find(d => d.key === docId)
  return doc?.title || toLabel(docId)
}

function isCurrentNav(docId: string): boolean {
  const route = router.currentRoute.value
  const slug = route.params.slug as string | undefined
  const routeDocId = camelize(slug || 'docs')

  return routeDocId === docId
}
</script>

<template>
  <div>
    <div class="mx-auto w-full max-w-screen-xl pt-40">
      <div class="lg:flex">
        <div
          class="flex items-center justify-center px-4 sm:px-6 lg:hidden xl:px-8"
        >
          <button
            id="main-menu"
            type="button"
            class="-mr-2 inline-flex items-center justify-center rounded-md p-2 font-semibold text-primary-500 hover:bg-primary-100 hover:text-primary-500 focus:bg-primary-100 focus:text-primary-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            aria-haspopup="true"
            aria-expanded="true"
            @click.stop="toggleDocsNav()"
          >
            Document Menu
            <span class="sr-only">Open docs menu</span>
            <!-- Heroicon name: menu -->
            <svg
              class="ml-2 h-6 w-6"
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
          class="inset-0 z-10 h-full w-full flex-none lg:static lg:block lg:h-auto lg:w-60 lg:overflow-y-visible lg:pt-0 xl:w-72"
          :class="
            vis ? 'block h-screen absolute top-16 z-50 lg:hidden p-2' : 'hidden'
          "
        >
          <div
            id="navWrapper"
            class="scrolling-touch overflow-hidden overflow-y-auto rounded-lg bg-white shadow-xl ring-1 ring-black/20 lg:sticky lg:top-8 lg:block lg:h-auto lg:bg-transparent lg:shadow-none lg:ring-0"
          >
            <div
              class="absolute right-2 top-2 z-20 flex items-center justify-end px-5 pt-4 lg:hidden"
            >
              <div class="-mr-3">
                <ElButton btn="default" @click="vis = !vis">
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
                </ElButton>
              </div>
            </div>
            <nav
              id="nav"
              class="overflow-y-auto px-4 text-base font-normal lg:text-sm"
            >
              <ul>
                <template v-for="(group, i) in groups" :key="i">
                  <li v-if="group.title" class="mt-4">
                    <router-link
                      class="mb-2 flex items-center px-3 text-base font-medium hover:text-primary-500"
                      :to="group.path ?? '/'"
                      :class="
                        isCurrentNav(i) ? 'text-primary-500' : 'text-theme-800'
                      "
                    >
                      <div
                        v-if="group.icon"
                        class="mr-3 h-4 w-4 overflow-hidden rounded-md"
                        v-html="group.icon"
                      />
                      <span class="title">{{ group.title }}</span>
                    </router-link>
                    <ul class="group-items">
                      <li v-for="(docId, ii) in group.menu" :key="ii">
                        <router-link
                          class="flex items-center px-3 py-2 hover:text-primary-500"
                          :to="docRoute(docId)"
                          :class="
                            isCurrentNav(docId)
                              ? 'text-primary-500'
                              : 'text-theme-500'
                          "
                        >
                          <div class="mr-3 h-4 w-4" />
                          <span class="title">{{ docTitle(docId) }}</span>
                        </router-link>
                      </li>
                    </ul>
                  </li>
                  <template v-else>
                    <li v-for="(docId, ii) in group.menu" :key="ii">
                      <a
                        class="text-theme-500 flex items-center px-3 py-2 transition-colors duration-200 hover:text-primary-500"
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
          class="w-full min-w-0 flex-auto lg:static lg:max-h-full lg:overflow-visible"
        >
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>
