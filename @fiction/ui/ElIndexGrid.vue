<script lang="ts" setup>
import type {
  ActionItem,
  IndexItem,
  IndexMeta,
} from '@fiction/core'
import {
  getNavComponentType,
  onResetUi,

  vue,
} from '@fiction/core'
import ElZeroBanner from './ElZeroBanner.vue'
import ElButton from './ElButton.vue'
import ElSpinner from './ElSpinner.vue'

const props = defineProps({
  list: {
    type: Array as vue.PropType<IndexItem[]>,
    default: () => [],
  },
  indexMeta: {
    type: Object as vue.PropType<IndexMeta>,
    default: () => ({}),
  },
  editActions: {
    type: Array as vue.PropType<string[]>,
    default: () => [],
  },
  empty: {
    type: Object as vue.PropType<{ title: string, description: string, actions?: ActionItem[], fig?: vue.Component }>,
    required: true,
  },
  actions: { type: Array as vue.PropType<ActionItem[]>, default: undefined },

  size: { type: String as vue.PropType<'xs' | 'md'>, default: undefined },
  loading: { type: Boolean, default: false },
  onItemClick: {
    type: Function as vue.PropType<(id: string | number) => void>,
    default: undefined,
  },
})
defineEmits<{
  (event: 'rowClick', payload: string): void
  (event: 'bulkEdit', payload: { _action: string, selectedIds: string[] }): void
}>()
const sending = vue.ref(false)
const activeDropdown = vue.ref<string | number | undefined>(undefined)
// const hasBulkEdit = vue.computed(() => props.editActions.length > 0)
const selected = vue.reactive<Record<string, boolean | undefined>>({})
const selectedIds = vue.computed(() => Object.keys(selected).filter(Boolean))
const selectAll = vue.ref<boolean | undefined>(false)
// const hasSelected = vue.computed(() => {
//   return Object.keys(selected).some(key => selected[key] === true)
// })
const editSelected = vue.ref<boolean | undefined>(false)
function resetSelected() {
  Object.keys(selected).forEach((k) => {
    selected[k] = undefined
  })
}
onResetUi(() => {
  editSelected.value = false
  activeDropdown.value = undefined
})
vue.watch(
  () => selectAll.value,
  (v) => {
    if (v) {
      props.list.forEach((r) => {
        const id = String(r.key || '')
        selected[id] = true
      })
    }
    else {
      resetSelected()
    }
  },
)

// function bulkEdit(_action: string) {
//   emit('bulkEdit', {
//     _action,
//     selectedIds: selectedIds.value,
//   })
//   resetUi()
//   resetSelected()
// }

async function handleOnClick(event: MouseEvent, action: ActionItem) {
  event.preventDefault()
  event.stopPropagation()
  sending.value = true
  if (action.onClick)
    await action.onClick({ event, item: action })
  sending.value = false
}
</script>

<template>
  <div class="flex flex-col text-sm font-medium">
    <div
      v-if="loading || sending"
      class="text-theme-300 flex items-center justify-center p-16"
    >
      <ElSpinner class="h-6 w-6" />
    </div>
    <div v-else class="border-t border-theme-200/80 dark:border-theme-700/80">
      <ul
        role="list"
        class="grid grid-cols-1 gap-x-6 xl:grid-cols-1 xl:gap-x-8 divide-y divide-theme-200/80 dark:divide-theme-700/80"
      >
        <li
          v-for="item in list"
          :key="item.key"
          class="col-span-1 @container"
          @click.stop="onItemClick && item.key ? onItemClick(item.key) : ''"
        >
          <div class="grid grid-cols-12 gap-4 lg:gap-8">
            <div class="self-center col-span-6 ">
              <div class="py-12 px-2 lg:px-4 @4xl:px-8">
                <div class="flex items-center space-x-3">
                  <h3 class=" text-2xl @4xl:text-4xl font-bold hover:opacity-80 cursor-pointer" @click="item.onClick?.({ event: $event })">
                    {{ item.name }}
                  </h3>
                </div>
                <div
                  v-if="item.links"
                  class="mt-1 text-xs @4xl:text-sm @6xl:text-base  space-x-4 flex items-center"
                >
                  <component
                    :is="getNavComponentType(link)"
                    v-for="(link, i) in item.links"
                    :key="i"
                    :href="link.href"
                    :to="link.href"
                    :target="link.target"
                    class="flex items-center space-x-1 text-theme-500 dark:text-theme-200 hover:text-primary-500"
                    :class="link.class"
                    @click.stop="link.onClick && link.onClick({ event: $event })"
                  >
                    <div v-if="link.icon" :class="link.icon" class="text-lg" />
                    <div>{{ link.name }}</div>
                  </component>
                </div>
                <div class="mt-5 space-y-4">
                  <div class="space-x-3">
                    <ElButton
                      v-for="(action, i) in item.actions"
                      :key="i"
                      :href="action.href"
                      :btn="action.btn"
                      @click.stop="action.onClick && action.onClick({ event: $event })"
                    >
                      {{ action.name }}
                    </ElButton>
                  </div>
                  <div v-if="item.tags?.length" class="space-x-3">
                    <span
                      v-for="(tag, i) in item.tags"
                      :key="i"
                      className="inline-flex items-center rounded  text-[10px] font-medium text-theme-500"
                    >
                      {{ tag.name }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="col-span-6 flex-col rounded-r-lg shrink-0  min-w-0"
            >
              <div
                class="w-full h-full text-theme-400 flex flex-col items-center justify-center gap-1 rounded-r-lg px-2 py-3"
              >
                <component :is="item.fig" v-if="item.fig" v-bind="item.figProps" />
                <div class="text-5xl" :class="item.icon" />
              </div>
            </div>
          </div>
        </li>
      </ul>
      <div v-if="list.length === 0">
        <ElZeroBanner
          :title="empty.title"
          :description="empty.description"
          :actions="empty.actions || actions"
        >
          <component :is="empty.fig" v-if="empty.fig" />
        </ElZeroBanner>
      </div>

      <nav
        v-else-if="actions?.length"
        class="bg-theme-0 mt-3 flex items-center justify-between pt-3"
        aria-label="Pagination"
      >
        <div class="">
          <ElButton
            v-for="(act, i) in actions"
            :key="i"
            :href="act.href"
            :btn="act.btn || 'default'"
            @click.stop="act.onClick ? handleOnClick($event, act) : null"
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
  </div>
</template>
