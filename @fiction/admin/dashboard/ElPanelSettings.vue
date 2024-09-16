<script lang="ts" setup>
import type { ActionItem, vue } from '@fiction/core'
import type { UiElementStyle } from '@fiction/ui/utils'
import XButton from '@fiction/ui/buttons/XButton.vue'

defineProps({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  raw: { type: Boolean, default: false },
  boxClass: { type: String, default: '' },
  panelClass: { type: String, default: '' },
  actions: {
    type: Array as vue.PropType<ActionItem[] >,
    default: () => [],
  },
})
</script>

<template>
  <section class="el-panel">
    <div class="h-full">
      <div class="box h-full" :class="panelClass || raw ? panelClass : ``">
        <div
          v-if="title || (actions && actions.length)"
          class="border-theme-200/50 dark:border-theme-700 flex items-center justify-between space-x-4 border-b px-3 py-2"
        >
          <h2 class="text-theme-800 dark:text-theme-0 font-brand text-sm font-semibold">
            {{ title }}
          </h2>
          <div
            v-if="actions && actions.length"
            class="flex shrink-0 items-end justify-end space-x-4"
          >
            <XButton
              v-for="(action, i) in actions"
              :key="i"
              :btn="(action.btn || 'default') as UiElementStyle"
              :size="action.size || 'md'"
              :loading="action.loading"
              :href="action.href"
              @click.stop="action.onClick ? action.onClick($event) : ''"
            >
              {{ action.name }}
            </XButton>
          </div>
        </div>

        <div :class="boxClass || raw ? boxClass : `p-3 md:px-8 md:pt-8 md:pb-12`">
          <slot />
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="less">
.el-panel {
  --input-x: 0.75em;
  --input-y: 0.5em;
  --input-max-width: 380px;
}
</style>
