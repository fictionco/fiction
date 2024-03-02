<script lang="ts" setup>
import type { FactorRouter, FactorUser } from '@fiction/core'
import { onBrowserEvent, onResetUi, useService, vue } from '@fiction/core'
import type { Card } from '@fiction/plugin-sites/card'
import ElImage from '@fiction/ui/ElImage.vue'
import type { UserConfig } from './ElHeader.vue'

const props = defineProps({
  vis: { type: Boolean, default: false },
  card: {
    type: Object as vue.PropType<Card<UserConfig>>,
    required: true,
  },
})

const emit = defineEmits(['update:vis'])

const uc = vue.computed(() => {
  return props.card.userConfig.value || {}
})

useService<{
  factorRouter: FactorRouter
  factorUser: FactorUser
}>()

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
          <div class="absolute inset-0 bg-slate-800 opacity-75" />
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
          class="from-theme-0 via-theme-50 to-theme-50 pointer-events-auto relative flex w-full max-w-xs flex-1 flex-col bg-gradient-to-br"
          @click.stop
        >
          <div
            class="absolute right-0 top-0 -mr-12 pt-2 transition-opacity"
            :class="afterVisible ? 'opacity-100' : 'opacity-0'"
          >
            <button
              class="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              @click.stop="close()"
            >
              <span class="sr-only">Close sidebar</span>
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

          <div class="h-14 shrink-0 items-center justify-between px-4 py-6">
            <RouterLink
              to="/"
              class="hover:text-primary-500 group inline-block w-full text-center focus:outline-none"
            >
              <ElImage :media="uc.logo" class="h-6" />
            </RouterLink>
          </div>

          <div class="h-full overflow-y-scroll p-5">
            <div
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="main-menu"
            >
              <template v-for="(item, i) in uc.nav" :key="i">
                <div class="my-4">
                  <div class="sub-menu font-sans">
                    <component
                      :is="
                        item.href?.includes('http')
                          ? 'a'
                          : item.href
                            ? 'RouterLink'
                            : 'div'
                      "
                      :to="item.href"
                      :href="item.href"
                      role="menuitem"
                      class="group items-center rounded-md px-3 py-2 hover:bg-color-50 hover:text-primary-500"

                      @click="item.onClick ? item.onClick($event) : null"
                    >
                      <span v-html="item.name" />
                    </component>
                  </div>
                </div>
              </template>
            </div>
          </div>
          <div class="flex items-center justify-between p-4 transition-opacity">
            <div class="m-0 flex w-full justify-center space-x-6 p-2">
              <a
                v-for="(item, i) in uc.socialList"
                :key="i"
                :href="item.href"
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
