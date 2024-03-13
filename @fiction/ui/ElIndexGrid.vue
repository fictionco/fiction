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
    <div v-else class=" ">
      <ul
        role="list"
        class="grid grid-cols-1 gap-x-6 gap-y-8 xl:grid-cols-1 xl:gap-x-8"
      >
        <li
          v-for="item in list"
          :key="item.key"
          class="col-span-1 rounded-lg border border-theme-200 dark:border-theme-700 bg-theme-0 dark:bg-theme-900 @container"
          @click.stop="onItemClick && item.key ? onItemClick(item.key) : ''"
        >
          <div class="grid grid-cols-12 gap-8">
            <div class="self-center col-span-8 @5xl:col-span-6">
              <div class="p-12 @5xl:p-16 @7xl:p-20">
                <div class="flex items-center space-x-3">
                  <h3 class="x-font-title tracking-tight text-3xl @4xl:text-5xl font-bold">
                    {{ item.name }}
                  </h3>
                </div>
                <div
                  v-if="item.links"
                  class="mt-1 text-xs @4xl:text-sm @6xl:text-base text-theme-400 dark:text-theme-200 space-x-4 flex"
                >
                  <component
                    :is="getNavComponentType(link)"
                    v-for="(link, i) in item.links"
                    :key="i"
                    :href="link.href"
                    :target="link.target"
                    class="flex items-center space-x-1"
                    :class="link.class"
                    @click.stop="link.onClick && link.onClick({ event: $event })"
                  >
                    <div v-if="link.icon">
                      <div :class="link.icon" class="text-lg" />
                    </div>
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
                  <div class="space-x-3">
                    <span
                      v-for="tag in item.tags"
                      :key="tag"
                      className="inline-flex items-center rounded bg-theme-100 px-2 py-0.5 text-[11px] font-medium text-theme-500"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="col-span-4 @5xl:col-span-6 flex-col rounded-r-lg shrink-0  min-w-0"
            >
              <div
                class="w-full h-full  border-l border-theme-100/50 dark:border-theme-700 bg-theme-25 dark:bg-theme-800 text-theme-400 flex flex-col items-center justify-center gap-1 rounded-r-lg px-2 py-3"
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
