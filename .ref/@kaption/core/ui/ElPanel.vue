<script lang="ts" setup>
import type { MenuItem, vue } from '@factor/api'
import ElButton from './ElButton.vue'

defineProps({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  raw: { type: Boolean, default: false },
  boxClass: { type: String, default: '' },
  panelClass: { type: String, default: '' },
  actions: {
    type: Array as vue.PropType<
      (MenuItem & { btn?: string, loading?: boolean, href?: string })[]
    >,
    default: () => [],
  },
})
</script>

<template>
  <section class="el-panel mx-auto max-w-[1200px]">
    <div class="">
      <div
        class="box"
        :class="
          panelClass || raw
            ? panelClass
            : `border-theme-300 border bg-theme-0 shadow-sm sm:rounded-lg`
        "
      >
        <div
          v-if="title || (actions && actions.length)"
          class="border-theme-200 flex items-center justify-between border-b px-3 py-2"
        >
          <h2 class="text-theme-800 text-sm font-semibold">
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
              size="md"
              :loading="action.loading"
              :href="action.href || action.link?.value || action.route?.value"
              @click="action.onClick ? action.onClick($event) : ''"
            >
              {{ action.name }}
            </ElButton>
          </div>
        </div>

        <div :class="boxClass || raw ? boxClass : `p-3 md:p-8`">
          <slot />
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="less">
.el-panel {
  --input-x: 1em;
  --input-y: 0.75em;
  --input-max-width: 380px;
}
</style>
