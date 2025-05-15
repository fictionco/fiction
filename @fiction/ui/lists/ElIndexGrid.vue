<script lang="ts" setup>
import type { ActionArea, ColorThemeUser, IndexMeta, NavListItem, PostObject, StandardSize } from '@fiction/core'
import { getPaginationInfo, vue } from '@fiction/core/index.js'
import XButton from '../buttons/XButton.vue'
import ElZeroBanner from '../ElZeroBanner.vue'
import ElSpinner from '../loaders/ElSpinner.vue'
import XIndexItem from './XIndexItem.vue'

const {
  list = [],
  indexMeta = {},
  empty,
  action = {},
  loading,
  listTitle = 'Items',
  theme,
  uiSize = 'md',
} = defineProps<{
  list?: NavListItem[]
  indexMeta?: IndexMeta
  empty?: PostObject
  action?: ActionArea
  loading?: boolean
  listTitle?: string
  theme?: ColorThemeUser
  uiSize?: StandardSize
}>()

const emit = defineEmits<{
  (event: 'update:offset', payload: number): void
}>()

const sending = vue.ref(false)

const pagination = vue.computed(() => getPaginationInfo(indexMeta))

async function paginate(dir: 'prev' | 'next') {
  const newPageNo = dir === 'prev' ? pagination.value.prevPageNo : pagination.value.nextPageNo
  if (newPageNo && newPageNo > 0) {
    const offset = (newPageNo - 1) * (pagination.value.limit || 20)
    emit('update:offset', offset)
  }
}
</script>

<template>
  <div class="flex flex-col text-sm ">
    <div
      v-if="loading || sending"
      class="text-theme-300 flex items-center justify-center p-16"
    >
      <ElSpinner class="h-6 w-6" />
    </div>
    <div v-else>
      <div class="mb-6 flex justify-between items-end" :data-list-count="indexMeta.count">
        <div class="text-base font-semibold leading-4 text-theme-300 dark:text-theme-500 antialiased">
          {{ listTitle }} <span v-if="indexMeta.count">({{ indexMeta.count }} total)</span>
        </div>
        <nav
          v-if="action.buttons?.length && list.length > 0"
          class="flex items-center justify-between"
          aria-label="Pagination"
        >
          <div class="flex gap-4">
            <XButton
              v-for="(act, i) in action.buttons"
              :key="i"
              :data-test-id="act.testId"
              :href="act.href"
              :theme="act.theme || 'default'"
              :rounding="act.rounding || 'full'"
              :icon="act.icon"
              :size="act.size || 'md'"
              @click.stop="act.onClick ? act.onClick({ event: $event, item: act }) : null"
            >
              {{ act.label }}
            </XButton>
          </div>
        </nav>
      </div>
      <div class="flex flex-col lg:gap-8 gap-4">
        <div class="w-full">
          <div v-if="list.length" role="list" class="space-y-8 xl:space-y-12">
            <template v-if="$slots.list">
              <slot name="list" :list />
            </template>
            <XIndexItem
              v-for="(item, i) in list"
              v-else
              :key="item.key"
              :ui-size="uiSize"
              :is-active="item.isActive"
              :item
              :index="i"
              :theme
            />
          </div>
          <div v-else-if="empty">
            <ElZeroBanner :model-value="empty" :theme />
          </div>
        </div>
      </div>

      <nav v-if="pagination.count && list.length" class="flex items-center justify-between  py-6  " aria-label="Pagination">
        <div class="hidden sm:block">
          <p class="text-sm">
            Showing
            <span class="font-medium">{{ pagination.start }}</span>
            to
            <span class="font-medium">{{ pagination.end }}</span>
            of
            <span class="font-medium">{{ pagination.total }}</span>
            results
          </p>
        </div>
        <div class="flex flex-1 justify-between sm:justify-end gap-3">
          <XButton :disabled="!pagination.prevPageNo" href="#" @click.prevent="paginate('prev')">
            Prev
          </XButton>
          <XButton :disabled="!pagination.nextPageNo" href="#" @click.prevent="paginate('next')">
            Next
          </XButton>
        </div>
      </nav>
    </div>
  </div>
</template>
