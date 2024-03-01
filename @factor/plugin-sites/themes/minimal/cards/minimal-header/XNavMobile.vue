<script lang="ts" setup>
import { getNavComponentType, onBrowserEvent, onResetUi, vue } from '@factor/api'
import type { Card } from '../../../../card'
import XSiteLogo from '../ui/XSiteLogo.vue'
import type { UserConfig } from './XHeader.vue'

const props = defineProps({
  card: {
    type: Object as vue.PropType<Card<UserConfig>>,
    required: true,
  },
})

const uc = vue.computed(() => {
  return props.card.userConfig.value || {}
})

const scrolled = vue.ref(false)

onBrowserEvent('scroll', () => {
  scrolled.value = window.pageYOffset > 50
})

const vis = vue.ref(false)
function close(): void {
  vis.value = false
}

onResetUi(() => close())
</script>

<template>
  <div class="relative z-40 lg:hidden">
    <div class="text-3xl z-30 relative" :class="vis ? 'text-white' : ''" @click.stop="vis = !vis">
      <div class="i-tabler-menu" />
    </div>
    <div class="pointer-events-none fixed inset-0 z-20 flex overflow-hidden h-full">
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
          <div class="absolute inset-0 bg-black/80" />
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
          <div class="h-full overflow-y-scroll p-5 1 pt-8 w-52 mx-auto">
            <div v-if="uc.logo" class="text-center mb-6">
              <XSiteLogo :logo="uc.logo" />
            </div>
            <div class="pt-6 space-y-2">
              <template v-for="(item, i) in uc.nav" :key="i">
                <div class=" font-sans">
                  <component
                    :is="getNavComponentType(item)"
                    :to="item.href"
                    :href="item.href"
                    role="menuitem"
                    class="group items-center  px-3 hover:bg-color-50 text-theme-700 tracking-tight hover:text-primary-500 text-lg py-2 font-bold block rounded-full text-center bg-theme-100"
                    @click="item.onClick ? item.onClick($event) : null"
                  >
                    <span v-html="item.name" />
                  </component>
                </div>
              </template>
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
