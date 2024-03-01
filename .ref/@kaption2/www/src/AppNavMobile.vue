<script lang="ts" setup>
import { onBrowserEvent, onResetUi, vue } from '@factor/api'
import ElButton from '@factor/ui/ElButton.vue'

import KaptionLogo from '@kaption/core/ui/KaptionLogo.vue'
import { useSiteService } from './inject'
import { socialList } from './map'
import { getDashboardUrl } from './util'
import type { SiteNavItem } from './featureNav'
import { featureNav } from './featureNav'

/* Nav visibility */
const props = defineProps({
  vis: { type: Boolean, default: false },
})
const emit = defineEmits(['update:vis'])
const { factorRouter } = useSiteService()
const afterVisible = vue.ref(false)
const visibleSubMenu = vue.ref('')
const scrolled = vue.ref(false)

onBrowserEvent('scroll', () => {
  scrolled.value = window.pageYOffset > 50
})

function close(): void {
  emit('update:vis', false)
}

onResetUi(() => close())

vue.watch(
  () => props.vis,
  (vis) => {
    if (vis) {
      setTimeout(() => {
        afterVisible.value = true
      }, 300)
    }
    else {
      afterVisible.value = false
    }
  },
)

async function clickNavItem(navItem: SiteNavItem): Promise<void> {
  if (navItem.path) {
    await factorRouter.push(navItem.path)
  }
  else if (navItem.subMenu) {
    visibleSubMenu.value
      = visibleSubMenu.value === navItem.name ? '' : navItem.name
  }
}
</script>

<template>
  <div class="relative z-40 lg:hidden">
    <div class="pointer-events-none fixed inset-0 z-40 flex">
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
          class="pointer-events-auto fixed inset-0"
          aria-hidden="true"
          @click.stop="close()"
        >
          <div class="bg-theme-900 absolute inset-0 opacity-75" />
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
          class="pointer-events-auto relative flex w-full max-w-xs flex-1 flex-col bg-gradient-to-br from-slate-900/80 via-black/90 to-slate-900/80 text-white"
          @click.stop
        >
          <div
            class="absolute top-0 right-0 -mr-12 pt-2 transition-opacity"
            :class="afterVisible ? 'opacity-100' : 'opacity-0'"
          >
            <button
              class="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              @click.stop="close()"
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
            class="flex h-14 shrink-0 items-center justify-between px-5 py-3"
          >
            <div>
              <router-link
                to="/"
                class="text-theme-500 group block w-full text-center hover:text-primary-500 focus:outline-none"
              >
                <div class="flex justify-center">
                  <KaptionLogo class="scheme-light h-5 w-auto" mode="logo" />
                </div>
              </router-link>
            </div>
          </div>

          <div class="h-full overflow-y-scroll p-5">
            <ElButton
              btn="primary"
              class="mt-2 mb-4 sm:text-base"
              :href="getDashboardUrl('/login')"
            >
              Sign In &rarr;
            </ElButton>
            <div
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="main-menu"
            >
              <div
                class="mt-3 mb-1 text-xs font-semibold uppercase tracking-widest text-primary-300"
              >
                Features
              </div>
              <template v-for="(navItem, i) in featureNav" :key="i">
                <div class="my-4">
                  <div
                    class="flex items-center space-x-3 font-bold"
                    @click="clickNavItem(navItem)"
                  >
                    <div class="">
                      {{ navItem.name }}
                    </div>
                    <div
                      v-if="navItem.subMenu"
                      class="i-carbon-chevron-down"
                    />
                  </div>
                  <div v-if="visibleSubMenu === navItem.name" class="sub-menu">
                    <a
                      v-for="(subMenuItem, ii) in navItem.subMenu"
                      :key="ii"
                      :href="subMenuItem.path"
                      role="menuitem"
                      class="group flex items-center rounded-md px-3 py-2 text-base font-medium hover:bg-color-50 hover:text-primary-500"
                    >
                      <div
                        class="mr-3 h-4 w-4 text-primary-300 group-hover:text-primary-500"

                        v-html="subMenuItem.icon"
                      />

                      <span>{{ subMenuItem.name }}</span>
                    </a>
                  </div>
                </div>
              </template>
            </div>
          </div>
          <div class="flex items-center justify-between p-4 transition-opacity">
            <div class="m-0 flex w-full justify-between space-x-3 px-3 py-0">
              <a
                v-for="(item, i) in socialList"
                :key="i"
                :href="item.path"
                class="inline-block"
                :target="item.target ? item.target : '_self'"
              >
                <span class="sr-only">{{ item.name }}</span>
                <span
                  class="text-white hover:text-primary-500"
                  v-html="item.icon"
                />
              </a>
            </div>
          </div>
        </div>
      </transition>
      <div class="w-14 shrink-0" aria-hidden="true">
        <!-- Dummy element to force sidebar to shrink to fit close icon -->
      </div>
    </div>
  </div>
</template>
