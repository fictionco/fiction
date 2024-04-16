<script lang="ts" setup>
import type { ActionItem, vue } from '@fiction/core'
import ElButton from './ElButton.vue'

defineProps({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  raw: { type: Boolean, default: false },
  boxClass: { type: String, default: '' },
  panelClass: { type: String, default: '' },
  actions: {
    type: Array as vue.PropType<ActionItem[]>,
    default: () => [],
  },
})
</script>

<template>
  <section class="el-panel">
    <div class="h-full">
      <div
        class="box h-full"
        :class=" panelClass || raw ? panelClass : `` "
      >
        <div
          v-if="title || (actions && actions.length)"
          class="flex items-baseline space-x-4 px-0 lg:px-6 py-2 "
        >
          <h2 v-if="title" class="font-brand text-lg font-semibold leading-snug">
            {{ title }}
          </h2>
          <div
            v-if="actions && actions.length"
            class="flex shrink-0 items-end justify-end space-x-4"
          >
            <ElButton
              v-for="(action, i) in actions"
              :key="i"
              :btn="action.btn || 'default'"
              :size="action.size || 'md'"
              :loading="action.loading"
              :href="action.href"
              @click.stop="action.onClick ? action.onClick($event) : ''"
            >
              {{ action.name }}
            </ElButton>
          </div>
        </div>

        <div :class="boxClass || raw ? boxClass : `py-2 px-0 lg:px-6`">
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
