<script lang="ts" setup>
import { onBrowserEvent, onResetUi, useService, vue } from '@fiction/core'
import type { Card } from '@fiction/plugin-sites/card'
import ElModal from '@fiction/ui/ElModal.vue'
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
  <ElModal :vis="vis" modal-class="p-0 max-w-xs" @update:vis="emit('update:vis', $event)">
    <div class="h-full overflow-y-scroll p-3">
      <div
        class="flex flex-col gap-3"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="main-menu"
      >
        <component
          :is="
            item.href?.includes('http')
              ? 'a'
              : item.href
                ? 'RouterLink'
                : 'div'
          "
          v-for="(item, i) in uc.nav"
          :key="i"
          :to="item.href"
          :href="item.href"
          role="menuitem"
          class="py-3 px-4 font-semibold font-sans text-lg group items-center rounded-md bg-theme-50 dark:bg-theme-800 hover:opacity-80 flex justify-between"

          @click="item.onClick ? item.onClick($event) : null"
        >
          <span v-html="item.name" />
          <span class="text-theme-500 dark:text-theme-600">&rarr;</span>
        </component>
      </div>
    </div>
  </ElModal>
</template>
