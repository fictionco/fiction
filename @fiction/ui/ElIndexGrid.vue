<script lang="ts" setup>
import type { ActionItem, IndexItem, IndexMeta } from '@fiction/core'
import { getNavComponentType, vue } from '@fiction/core'
import ElZeroBanner from './ElZeroBanner.vue'
import ElButton from './ElButton.vue'
import ElSpinner from './loaders/ElSpinner.vue'

defineProps({
  list: { type: Array as vue.PropType<IndexItem[]>, default: () => [] },
  listTitle: { type: String, default: 'Items' },
  indexMeta: { type: Object as vue.PropType<IndexMeta>, default: () => ({}) },
  editActions: { type: Array as vue.PropType<string[]>, default: () => [] },
  empty: { type: Object as vue.PropType<IndexItem>, required: false },
  actions: { type: Array as vue.PropType<ActionItem[]>, default: undefined },
  size: { type: String as vue.PropType<'xs' | 'md'>, default: undefined },
  loading: { type: Boolean, default: false },
  onItemClick: { type: Function as vue.PropType<(id: string | number) => void>, default: undefined },
})

const sending = vue.ref(false)

const boxClass = 'dark:bg-theme-800 hover:bg-theme-50 dark:hover:bg-theme-700 px-6 border border-theme-300/70 shadow-xs dark:border-theme-600/60 rounded-xl'
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
      <div class="mb-6 flex justify-between items-end">
        <div class="text-base font-medium leading-4 text-theme-500 dark:text-theme-500">
          {{ listTitle }} ({{ list.length }})
        </div>
        <nav
          v-if="actions?.length"
          class="mt-3 flex items-center justify-between pt-3"
          aria-label="Pagination"
        >
          <div class="">
            <ElButton
              v-for="(act, i) in actions"
              :key="i"
              :href="act.href"
              :btn="act.btn || 'default'"
              :icon="act.icon"
              size="md"
              @click.stop="act.onClick ? act.onClick({ event: $event, item: act }) : null"
            >
              {{ act.name }}
            </ElButton>
          </div>
          <div v-if="indexMeta.count" class="hidden sm:block">
            <div class="text-theme-400 mr-2">
              {{ indexMeta.count }} total
            </div>
          </div>
        </nav>
      </div>
      <ul role="list" class="space-y-8">
        <li
          v-for="item in list"
          :key="item.key"
          @click.stop="onItemClick && item.key ? onItemClick(item.key) : ''"
        >
          <component :is="getNavComponentType(item)" :to="item.href" :href="item.href" class="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 py-5 sm:flex-nowrap" :class="boxClass">
            <div>
              <p class="text-lg font-semibold leading-6 ">
                <a href="#" class="hover:underline">{{ item.name }}</a>
              </p>
              <div class="mt-1 flex items-center gap-x-2 text-sm leading-5 text-gray-500">
                <p>
                  <a href="#" class="hover:underline">{{ item.desc }}</a>
                </p>
              </div>
            </div>
            <dl class="flex w-full flex-none justify-between gap-x-8 sm:w-auto items-center">
              <slot :item="item" name="item" />

              <div class="hidden sm:flex sm:flex-col sm:items-end">
                <p class="text-sm leading-6  ">
                  Published
                </p>
              </div>
              <svg class="h-5 w-5 flex-none text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
              </svg>
            </dl>
          </component>
        </li>
      </ul>
      <div v-if="list.length === 0 ">
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
  </div>
</template>
