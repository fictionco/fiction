<script lang="ts" setup>
import type { ActionItem, IndexMeta } from '@fiction/core'
import { onResetUi, resetUi, toLabel, vue } from '@fiction/core'
import ElZeroBanner from './ElZeroBanner.vue'
import ElButton from './ElButton.vue'
import InputCheckbox from './inputs/InputCheckbox.vue'
import ElSpinner from './ElSpinner.vue'

export type TableCell =
  | {
    type: 'callback' | 'link' | 'icon' | 'slot'
    text?: string
    name?: string
    item: unknown
    callback?: (id: string) => Promise<void> | void
    link?: vue.Ref<string | undefined>
    iconClass?: string
  }
  | string
  | number
  | undefined

export type TableData = TableCell[][]
const props = defineProps({
  table: {
    type: Array as vue.PropType<TableData>,
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
    type: Object as vue.PropType<{ title: string, description: string }>,
    required: true,
  },
  actions: { type: Array as vue.PropType<ActionItem[]>, default: undefined },
  rowLink: {
    type: Function as vue.PropType<(id: string) => string | undefined>,
    default: undefined,
  },
  size: { type: String as vue.PropType<'xs' | 'md'>, default: undefined },
  loading: { type: Boolean, default: false },
  onRowClick: {
    type: Function as vue.PropType<(id: string) => void>,
    default: undefined,
  },
})
const emit = defineEmits<{
  (event: 'rowClick', payload: string): void
  (event: 'bulkEdit', payload: { _action: string, selectedIds: string[] }): void
}>()
const sending = vue.ref(false)
const hasBulkEdit = vue.computed(() => props.editActions.length > 0)
const selected = vue.reactive<Record<string, boolean | undefined>>({})
const selectedIds = vue.computed(() => Object.keys(selected).filter(Boolean))
const selectAll = vue.ref<boolean | undefined>(false)
const hasSelected = vue.computed(() => {
  return Object.keys(selected).some(key => selected[key] === true)
})
const editSelected = vue.ref<boolean | undefined>(false)
function resetSelected() {
  Object.keys(selected).forEach((k) => {
    selected[k] = undefined
  })
}
onResetUi(() => {
  editSelected.value = false
})

const rows = vue.computed(() => {
  return props.table.slice(1)
})

vue.watch(
  () => selectAll.value,
  (v) => {
    if (v) {
      rows.value.forEach((r) => {
        const id = String(r[0] || '')
        selected[id] = true
      })
    }
    else {
      resetSelected()
    }
  },
)
const headers = vue.computed(() => {
  return props.table[0]?.slice(1)
})

const titleIndex = vue.computed(() => {
  return headers.value?.findIndex(Boolean)
})

function getColumnClass(type: 'header' | 'row', index: number, _total: number, _col: TableCell): string {
  const cl: string[] = []
  if (type === 'row' && index !== titleIndex.value) {
    cl.push('text-theme-500')
    if (props.size !== 'xs')
      cl.push(' min-w-[130px]')
  }
  if (index === titleIndex.value) {
    if (type === 'row')
      cl.push('font-bold  tracking-tight')

    if (props.size === 'xs')
      cl.push('max-w-[100px]')
    else
      cl.push('max-w-lg')

    cl.push('text-left')
  }
  else {
    cl.push('text-left')
    if (type === 'row')
      cl.push('text-theme-500')
  }

  return cl.join(' ')
}

const cellClass = vue.computed(() => {
  const out = ['text-ellipsis overflow-hidden']
  if (props.size === 'xs')
    out.push('px-1 py-1 text-[10px]')
  else
    out.push('py-3 px-3')

  return out.join(' ')
})

function bulkEdit(_action: string) {
  emit('bulkEdit', {
    _action,
    selectedIds: selectedIds.value,
  })
  resetUi()
  resetSelected()
}

async function handleOnClick(event: MouseEvent, item: ActionItem) {
  event.preventDefault()
  event.stopPropagation()
  sending.value = true
  if (item.onClick)
    await item.onClick({ event, item })

  sending.value = false
}
</script>

<template>
  <div class="flex flex-col text-sm font-medium">
    <div
      v-if="loading || sending"
      class="text-theme-300 flex items-center justify-center p-12"
    >
      <ElSpinner class="h-6 w-6" />
    </div>
    <div v-else-if="table.length === 0" class="p-12 text-center">
      No items found.
    </div>
    <div
      v-else
      class="min-w-full overflow-hidden overflow-x-auto align-middle sm:rounded-lg"
    >
      <table
        v-if="rows.length > 0"
        class="divide-theme-200/70 dark:divide-theme-600 min-w-full divide-y"
      >
        <thead>
          <tr>
            <th v-if="hasBulkEdit" class="px-3 text-left">
              <InputCheckbox v-model="selectAll" />
            </th>
            <th
              v-for="(col, ii) in headers"
              :key="ii"
              class="py-2 px-3 font-medium"
              :class="[getColumnClass('header', ii, headers?.length || 0, col)]"
            >
              <div
                v-if="ii === 0 && hasSelected"
                class="relative"
                @click.stop
              >
                <ElButton
                  btn="primary"
                  size="xs"
                  @click.stop="editSelected = true"
                >
                  Edit Selected
                  <div class="i-carbon-chevron-down ml-1 text-base" />
                </ElButton>
                <div
                  v-if="editSelected"
                  class="bg-theme-0 absolute z-10 w-56 overflow-hidden rounded shadow-lg ring-1 ring-black/5"
                  :style="{ top: 'calc(100% + 5px)' }"
                >
                  <div
                    v-for="(_action, iii) in editActions"
                    :key="iii"
                    class="hover:bg-theme-50 hover:text-primary-500 cursor-pointer px-4 py-2"
                    @click="bulkEdit(_action)"
                  >
                    {{ toLabel(_action) }}
                  </div>
                </div>
              </div>
              <span v-else class="text-theme-400 text-sm">{{ col }}</span>
            </th>
          </tr>
        </thead>

        <tbody
          v-if="rows.length > 0"
          class="divide-theme-200 bg-theme-0 dark:bg-theme-900 dark:divide-theme-600 divide-y"
        >
          <tr
            v-for="(row, i) in rows"
            :id="String(row[0] || '')"
            :key="i"
            class="group relative"
            :class="onRowClick ? 'hover:bg-theme-50 dark:hover:bg-theme-800 cursor-pointer' : ''"
            @click="onRowClick ? onRowClick(String(row[0] || '')) : ''"
          >
            <td
              v-if="hasBulkEdit"
              class="theme-0space-nowrap"
              :class="cellClass"
              @click.stop
            >
              <InputCheckbox
                v-model="selected[String(row[0] || '')]"
              />
            </td>
            <td
              v-for="(col, ii) in row.slice(1)"
              :key="ii"
              class="theme-0 space-nowrap"
              :class="getColumnClass('row', ii, row.slice(1).length, col)"
            >
              <template v-if="typeof col === 'object' && col?.type === 'slot'">
                <slot
                  :name="col.name"
                  :item="col.item"
                  :row="row"
                />
              </template>
              <template
                v-else-if="
                  typeof col === 'object'
                    && (col?.type === 'link' || col?.type === 'callback')
                "
              >
                <div :class="cellClass">
                  <component
                    :is="col.type === 'callback' ? 'div' : 'RouterLink'"
                    class="text-primary-500 hover:text-primary-600 inline-flex items-center font-medium"
                    :to="col.link?.value ? col.link.value : ''"
                    @click="col.callback ? col.callback(row[0] as string) : ''"
                    v-html="col.name || 'View'"
                  />
                </div>
              </template>
              <template v-else-if="rowLink">
                {{ rowLink(row[0] as string) }}
                <RouterLink
                  class="block h-full w-full"
                  :class="cellClass"
                  :to="rowLink(row[0] as string) || ''"
                >
                  <template
                    v-if="col && typeof col === 'object' && col.type === 'icon'"
                  >
                    <span class="flex items-center space-x-3">
                      <span :class="col.iconClass" />
                      <span class="">{{ col.text }}</span>
                    </span>
                  </template>
                  <template v-else>
                    {{ col }}
                  </template>
                </RouterLink>
              </template>
              <template v-else>
                <div :class="cellClass">
                  {{ col }}
                </div>
              </template>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="rows.length === 0">
        <ElZeroBanner
          :title="empty.title"
          :description="empty.description"
          :actions="actions"
        >
          <slot name="empty" />
        </ElZeroBanner>
      </div>

      <nav
        v-else-if="actions?.length"
        class="border-theme-200 bg-theme-0 flex items-center justify-between border-t"
        :class="cellClass"
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
