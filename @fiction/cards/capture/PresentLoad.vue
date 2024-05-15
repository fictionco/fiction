<script lang="ts" setup>
import { localRef, vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import type { UserConfig } from '.'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
  loading: { type: Boolean, default: true },
  isSubscribed: { type: Boolean, default: false },
})

const uc = vue.computed(() => props.card.userConfig.value || {})

const hide = localRef({ key: `hide-capture-onLoad-${props.card.site?.siteId}`, def: false, lifecycle: 'local' })

vue.watchEffect(() => {
  const h = hide.value
  if (h)
    document.body.style.overflow = 'auto'
  else
    document.body.style.overflow = 'hidden'
})
</script>

<template>
  <transition
    enter-active-class="ease-[cubic-bezier(0.25,1,0.33,1)] duration-300"
    enter-from-class="opacity-0 translate-y-24 sm:translate-y-0 sm:scale-50"
    enter-to-class="opacity-100 translate-y-0 sm:scale-100"
    leave-active-class="ease-[cubic-bezier(0.25,1,0.33,1)] duration-200"
    leave-from-class="opacity-100 translate-y-0 sm:scale-100"
    leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-50"
  >
    <div
      v-if="!hide && !isSubscribed"
      class="z-[10000] text-theme-800 dark:text-theme-0 fixed left-0 top-0 flex h-full w-full items-center justify-center bg-theme-0 dark:bg-theme-900"
    >
      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div
          class="flex min-h-full flex-col items-center justify-center p-4 text-center sm:items-center sm:p-0"
        >
          <div
            class="relative w-full overflow-hidden rounded-lg  px-8 pb-8 pt-10 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-12"
          >
            <slot />
          </div>
          <div class="p-8 text-xs font-sans antialiased font-medium">
            <a class="text-theme-300 dark:text-theme-300 hover:opacity-80 cursor-pointer" @click="hide = true">{{ uc.dismissText }} &rarr;</a>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
