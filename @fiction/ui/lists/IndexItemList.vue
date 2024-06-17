<script lang="ts" setup>
import type { ActionItem, IndexItem, vue } from '@fiction/core'
import { getNavComponentType } from '@fiction/core'
import ElImage from '@fiction/ui/media/ElImage.vue'
import ElSpinner from '@fiction/ui/loaders/ElSpinner.vue'
import ElActions from '@fiction/ui/buttons/ElActions.vue'

const props = defineProps({
  list: { type: Array as vue.PropType<IndexItem[]>, required: true },
  loading: { type: Boolean, default: false },
  zeroText: { type: String, default: 'No items found' },
  actions: { type: Array as vue.PropType<ActionItem[]>, default: () => [] },
})

const mediaClass = `size-14 border-2 border-theme-200/50 bg-theme-50 dark:bg-theme-700 dark:text-theme-0 dark:border-theme-0 rounded-lg overflow-hidden text-theme-500/50`
</script>

<template>
  <div>
    <div v-if="loading" class="p-12 flex justify-center text-theme-400 dark:text-theme-500">
      <ElSpinner class="size-8" />
    </div>
    <div v-else-if="!list || list.length === 0">
      <div class="p-6 text-center">
        <p class="text-theme-400">
          {{ zeroText }}
        </p>
        <ElActions class="mt-4 gap-4 flex justify-center" :actions="actions" ui-size="sm" />
      </div>
    </div>
    <div v-else class="p-6 space-y-6">
      <component
        :is="getNavComponentType(item)"
        v-for="(item, i) in list"
        :key="i"
        class="relative isolate flex gap-6  hover:opacity-90 cursor-pointer"
        :href="item.href"
        :to="item.href"
      >
        <div>
          <div v-if="!item.media?.url && !item.media?.html" class="flex items-center justify-center size-12" :class="mediaClass">
            <div class="text-2xl" :class="item.icon" />
          </div>
          <ElImage v-else :class="mediaClass" :media="item.media" />
        </div>
        <div class="">
          <div v-if="$slots.details" class="flex items-center text-xs text-theme-500 dark:text-theme-400 gap-2">
            <slot name="details" :item="item" />
          </div>
          <div class="group relative max-w-xl">
            <h3 class="text-xl mt-1 font-semibold hover:underline x-font-title">
              {{ item.name }}
            </h3>
            <p class="text-sm  dark:text-theme-400 ">
              {{ item.desc }}
            </p>
          </div>
        </div>
      </component>
    </div>
  </div>
</template>
