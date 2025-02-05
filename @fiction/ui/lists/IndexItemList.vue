<script lang="ts" setup>
import type { ActionArea, ColorThemeUser, IndexItem } from '@fiction/core'
import XButtonList from '@fiction/ui/buttons/XButtonList.vue'
import XLink from '@fiction/ui/common/XLink.vue'
import ElSpinner from '@fiction/ui/loaders/ElSpinner.vue'
import ElIndexItemMedia from './ElIndexItemMedia.vue'

const { list, loading = false, zeroText = 'No items found', action = {}, theme } = defineProps<{
  list: IndexItem[]
  loading?: boolean
  zeroText?: string
  action?: ActionArea
  theme?: ColorThemeUser
}>()
</script>

<template>
  <div class="@container">
    <div
      v-if="loading"
      class="p-12 flex justify-center text-theme-400 dark:text-theme-500"
    >
      <ElSpinner class="size-8" />
    </div>

    <div v-else-if="!list || list.length === 0">
      <div class="p-12 text-center">
        <p class="text-theme-400">
          {{ zeroText }}
        </p>
        <XButtonList
          v-if="action.buttons?.length"
          class="mt-4 gap-4 flex justify-center"
          :buttons="action.buttons"
        />
      </div>
    </div>

    <div v-else class="divide-y divide-theme-100 dark:divide-theme-700">
      <XLink
        v-for="(item, i) in list"
        :key="i"
        class="relative isolate flex gap-6 items-center hover:opacity-90 cursor-pointer py-6"
        :href="item.href"
      >
        <ElIndexItemMedia class="size-12 @md:size-16" :media="item.media" :icon="item.icon" :theme />

        <div>
          <div
            v-if="$slots.details"
            class="flex items-center text-xs text-theme-500 dark:text-theme-400 gap-2"
          >
            <slot name="details" :item="item" />
          </div>
          <div class="group relative max-w-xl space-y-1.5">
            <h3 class="text-lg @md:text-xl mt-1 font-medium hover:underline x-font-title">
              {{ item.label }}
            </h3>
            <div
              v-if="$slots.subTitle"
              class="text-sm text-theme-500 dark:text-theme-400"
            >
              <slot name="subTitle" :item="item" />
            </div>
            <p v-else class="text-sm  text-theme-500 dark:text-theme-400">
              {{ item.description }}
            </p>
          </div>
        </div>
      </XLink>
    </div>
  </div>
</template>
