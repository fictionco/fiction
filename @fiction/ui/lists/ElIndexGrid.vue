<script lang="ts" setup>
import type { ActionItem, IndexItem, IndexMeta } from '@fiction/core'
import { getNavComponentType, getPaginationInfo, vue } from '@fiction/core/index.js'
import XButton from '../buttons/XButton.vue'
import ElZeroBanner from '../ElZeroBanner.vue'
import ElSpinner from '../loaders/ElSpinner.vue'
import ElIndexItemMedia from './ElIndexItemMedia.vue'

const props = defineProps({
  list: { type: Array as vue.PropType<IndexItem[]>, default: () => [] },
  listTitle: { type: String, default: 'Items' },
  indexMeta: { type: Object as vue.PropType<IndexMeta>, default: () => ({}) },
  editActions: { type: Array as vue.PropType<string[]>, default: () => [] },
  empty: { type: Object as vue.PropType<IndexItem>, required: false },
  actions: { type: Array as vue.PropType<ActionItem[]>, default: undefined },
  size: { type: String as vue.PropType<'xs' | 'md'>, default: undefined },
  loading: { type: Boolean, default: false },
  onItemClick: { type: Function as vue.PropType<((id: string | number) => void) | undefined>, default: undefined },
  mediaIcon: { type: String, default: 'i-tabler-photo' },
})

const emit = defineEmits<{
  (event: 'update:offset', payload: number): void
}>()

const sending = vue.ref(false)

const boxClass = 'dark:bg-theme-800 bg-theme-0 hover:bg-theme-50 dark:hover:bg-theme-700 px-6 border border-theme-300/70 shadow-xs dark:border-theme-600/60 rounded-xl'
const mediaClass = `size-14 ring-2 ring-theme-200/50 bg-theme-50 dark:bg-theme-400 dark:text-theme-0 dark:ring-theme-0 rounded-full overflow-hidden text-theme-500/50`

const pagination = vue.computed(() => getPaginationInfo(props.indexMeta))

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
      <div v-if="list.length > 0" class="mb-6 flex justify-between items-end">
        <div class="text-base font-semibold leading-4 text-theme-300 dark:text-theme-500 antialiased">
          {{ listTitle }} <span v-if="indexMeta.count">({{ indexMeta.count }} total)</span>
        </div>
        <nav
          v-if="actions?.length && list.length > 0"
          class="flex items-center justify-between"
          aria-label="Pagination"
        >
          <div class="flex gap-4">
            <XButton
              v-for="(act, i) in actions"
              :key="i"
              :data-test-id="act.testId"
              :href="act.href"
              :theme="act.theme || 'default'"
              :rounding="act.rounding || 'full'"
              :icon="act.icon"
              size="md"
              @click.stop="act.onClick ? act.onClick({ event: $event, item: act }) : null"
            >
              {{ act.name }}
            </XButton>
          </div>
        </nav>
      </div>
      <div class="grid grid-cols-12 lg:gap-8 gap-4">
        <div :class="$slots.sidebar ? 'col-span-12 md:col-span-6 xl:col-span-8' : 'col-span-12'">
          <ul v-if="list.length" role="list" class="space-y-5">
            <li
              v-for="item in list"
              :key="item.key"
              @click.stop="onItemClick && item.key ? onItemClick(item.key) : ''"
            >
              <component :is="getNavComponentType(item)" :to="item.href" :href="item.href" class="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 py-5 sm:flex-nowrap" :class="boxClass">
                <div class="flex gap-6 items-center">
                  <ElIndexItemMedia :media="item.media" :icon="item.icon" />
                  <div>
                    <p class="text-lg font-medium leading-6 ">
                      <span class="hover:underline cursor-pointer">{{ item.name }}</span>
                    </p>
                    <div class="mt-1 flex items-center gap-x-2 text-sm leading-5 text-theme-500">
                      <p>
                        <span class="hover:underline cursor-pointer">{{ item.desc }}</span>
                      </p>
                    </div>
                  </div>
                </div>
                <dl class="flex w-full flex-none justify-between gap-x-8 sm:w-auto items-center">
                  <slot :item="item" name="item" />

                  <div class="hidden sm:flex sm:flex-col sm:items-end">
                    <p class="text-sm leading-6  ">
                      {{ item.slug }}
                    </p>
                  </div>
                  <svg class="h-5 w-5 flex-none text-theme-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
                  </svg>
                </dl>
              </component>
            </li>
          </ul>
          <div v-else>
            <template v-if="$slots.zero">
              <slot name="zero" />
            </template>
            <ElZeroBanner
              v-else
              :title="empty?.name || 'No items found'"
              :description="empty?.desc || 'Try creating a new one.'"
              :actions="empty?.actions || actions"
              :icon="empty?.icon || 'i-heroicons-search'"
            >
              <template v-if="empty?.figure?.el" #figure>
                <component :is="empty?.figure.el" />
              </template>
            </ElZeroBanner>
          </div>
        </div>
        <div v-if="$slots.sidebar" class="col-span-12 md:col-span-6 xl:col-span-4">
          <slot name="sidebar" />
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
