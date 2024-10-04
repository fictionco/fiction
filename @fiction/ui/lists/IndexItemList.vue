<script lang="ts" setup>
import type { ActionButton, IndexItem, vue } from '@fiction/core'
import ElActions from '@fiction/ui/buttons/ElActions.vue'
import XLink from '@fiction/ui/common/XLink.vue'
import ElSpinner from '@fiction/ui/loaders/ElSpinner.vue'
import ElIndexItemMedia from './ElIndexItemMedia.vue'

defineProps({
  list: { type: Array as vue.PropType<IndexItem[]>, required: true },
  loading: { type: Boolean, default: false },
  zeroText: { type: String, default: 'No items found' },
  actions: { type: Array as vue.PropType<ActionButton[]>, default: () => [] },
})
</script>

<template>
  <div>
    <div
      v-if="loading"
      class="p-12 flex justify-center text-theme-400 dark:text-theme-500"
    >
      <ElSpinner class="size-8" />
    </div>

    <div v-else-if="!list || list.length === 0">
      <div class="p-6 text-center">
        <p class="text-theme-400">
          {{ zeroText }}
        </p>
        <ElActions
          class="mt-4 gap-4 flex justify-center"
          :actions="actions"
          ui-size="sm"
        />
      </div>
    </div>

    <div v-else class="px-6 divide-y divide-theme-100 dark:divide-theme-700">
      <XLink
        v-for="(item, i) in list"
        :key="i"
        class="relative isolate flex gap-6 items-center hover:opacity-90 cursor-pointer py-6"
        :href="item.href"
      >
        <ElIndexItemMedia class="size-16" :media="item.media" :icon="item.icon" />

        <div>
          <div
            v-if="$slots.details"
            class="flex items-center text-xs text-theme-500 dark:text-theme-400 gap-2"
          >
            <slot name="details" :item="item" />
          </div>
          <div class="group relative max-w-xl space-y-1.5">
            <h3 class="text-xl mt-1 font-semibold hover:underline x-font-title leading-tight">
              {{ item.name }}
            </h3>
            <div
              v-if="$slots.subTitle"
              class="text-sm dark:text-theme-400"
            >
              <slot name="subTitle" :item="item" />
            </div>
            <p v-else class="text-sm dark:text-theme-400">
              {{ item.desc }}
            </p>
          </div>
        </div>
      </XLink>
    </div>
  </div>
</template>
