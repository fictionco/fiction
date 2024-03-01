<script lang="ts" setup>
import { onBrowserEvent, onResetUi, vue } from '@factor/api'

import FictionLogo from '@fiction/core/ui/FictionLogo.vue'
import { socialList } from '../map'
import { nav } from '../util'

/* Nav visibility */
const props = defineProps({
  vis: { type: Boolean, default: false },
})
const emit = defineEmits(['update:vis'])
const afterVisible = vue.ref(false)
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

          <div class="h-14 shrink-0 items-center justify-between py-6 px-4">
            <RouterLink
              to="/"
              class="hover:text-primary-500 group inline-block w-full text-center focus:outline-none"
            >
              <FictionLogo class="h-8 w-24" mode="logo" />
            </RouterLink>
          </div>

          <div class="h-full overflow-y-scroll p-5">
            <div
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="main-menu"
            >
              <template v-for="(item, i) in nav" :key="i">
                <div class="my-4">
                  <div class="sub-menu">
                    <component
                      :is="
                        !item.value
                          ? 'div'
                          : item.value.includes('http')
                            ? 'a'
                            : 'router-link'
                      "
                      :to="item.value"
                      :href="item.value"
                      role="menuitem"
                      class="group grid grid-cols-12 items-center rounded-md px-3 py-2 text-base font-medium hover:bg-color-50 hover:text-primary-500"

                      @click="item.cb ? item.cb($event) : null"
                    >
                      <div class="col-span-2">
                        <div
                          class="mr-3 text-2xl"
                          :class="`text-primary-300 group-hover:text-primary-500 ${item.icon}`"
                        />
                      </div>

                      <span class="col-span-10">{{ item.name }}</span>
                    </component>
                  </div>
                </div>
              </template>
            </div>
          </div>
          <div class="flex items-center justify-between p-4 transition-opacity">
            <div class="m-0 flex w-full justify-center space-x-6 p-2">
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
