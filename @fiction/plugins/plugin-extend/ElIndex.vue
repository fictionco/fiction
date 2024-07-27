<script lang="ts" setup>
import type { ColorThemeUser } from '@fiction/core'
import { useService, vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import { getColorThemeStyles } from '@fiction/ui/utils.js'
import ElButton from '@fiction/ui/ElButton.vue'
import type { FictionExtend } from '.'

defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

type UserConfig = {
  isNavItem: boolean
}
const service = useService<{ fictionExtend: FictionExtend }>()

const list = vue.computed(() => {
  return service.fictionExtend.extensions.value.map(ext => ({ ...ext, key: ext.extensionId }))
})

function getStyle(theme: ColorThemeUser) {
  const s = getColorThemeStyles(theme)

  return [s.bg, s.text, s.ring, 'ring-1'].join(' ')
}
</script>

<template>
  <div class="grid sm:grid-cols-2   md:grid-cols-2 gap-3 sm:gap-6">
    <!-- Card -->
    <a v-for="(item, i) in list" :key="i" class="group flex flex-col border border-theme-300/70 dark:border-theme-600 rounded-xl  transition dark:hover:bg-theme-700/50" href="#">
      <div class="p-4 md:p-5">
        <div class="flex justify-between items-center gap-4">
          <div class="flex items-center gap-4">
            <span class="inline-flex rounded-lg p-3" :class="getStyle('blue')">

              <div class="i-tabler-pin text-3xl" />
            </span>
            <div class="ms-3">
              <h3 class="x-font-title font-semibold ">
                {{ item.name }}
              </h3>
              <div class="text-sm text-theme-500 dark:text-theme-400">
                {{ item.desc }}
              </div>
            </div>
          </div>

          <div class="flex gap-2">
            <ElButton btn="primary" icon="i-tabler-plus">Enable</ElButton>
            <ElButton btn="default" icon="i-tabler-x">Disable</ElButton>
          </div>
        </div>
      </div>
    </a>
  </div>
</template>
