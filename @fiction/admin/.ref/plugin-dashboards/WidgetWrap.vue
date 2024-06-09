<script lang="ts" setup>
import type { FactorRouter, MenuItem } from '@factor/api'
import { emitEvent, useService, vue } from '@factor/api'
import ElSpinner from '../../../@factor/ui/ElSpinner.vue'
import ElButton from '../../../@factor/ui/ElButton.vue'
import type { ClientWidget } from './widget'
import type { FactorDashboard } from '.'

const props = defineProps({
  title: { type: String, default: undefined },
  description: { type: String, default: undefined },
  loading: { type: Boolean, default: false },
  widget: { type: Object as vue.PropType<ClientWidget>, default: undefined },
  editable: { type: Boolean, default: false },
  actions: {
    type: Array as vue.PropType<
      (MenuItem & { btn?: string, loading?: boolean, href?: string })[]
    >,
    default: undefined,
  },
})

const { factorDashboard, factorRouter } = useService<{
  factorDashboard: FactorDashboard
  factorRouter: FactorRouter
}>()

const widgetActions = vue.computed(() => {
  const actions = props.actions || []

  if (props.editable) {
    actions.push({
      name: 'Edit',
      btn: 'default',
      onClick: (e) => {
        e?.stopPropagation()
        emitEvent('editWidget', props.widget)
      },
    })
  }
  return actions
})

// add widget sql query for debugging to widget template
// if query param of ?sql is set
const widgetSql = vue.computed<string | undefined>(() => {
  const q = factorRouter.query.value

  if (q.sql === undefined)
    return undefined

  const data = (props.widget?.data?.value || {}) as Record<string, any>
  return data?.sql as string | undefined
})

const widgetLayout = vue.computed<
  | {
    widgetComponent: vue.Component
    classes: string
  }
  | undefined
>(() => {
  const widget = props.widget

  if (!widget)
    return

  const widgetDefinition = factorDashboard.getWidgetDefinition(widget.widgetKey)

  if (!widgetDefinition)
    throw new Error(`no widget def ${widget.widgetKey}`)

  const el = widget.el

  if (!el)
    throw new Error('no component defined for widget')
  /**
   * COMPONENT LOADING
   */
  const widgetComponent: vue.Component = vue.defineAsyncComponent(el)

  /**
   * GRID SIZING
   */

  const rowSpan = widget.rowSpan.value
  const colSpan = widget.colSpan.value

  const classList = []

  if (colSpan === 1)
    classList.push(`lg:col-span-3 2xl:col-span-1`)
  else if (colSpan === 2)
    classList.push(`md:col-span-4 2xl:col-span-2`)
  else if (colSpan === 3)
    classList.push(`sm:col-span-6 2xl:col-span-3`)
  else if (colSpan === 4)
    classList.push(`lg:col-span-12 2xl:col-span-4`)
  else if (colSpan === 6)
    classList.push(`lg:col-span-12 xl:col-span-6`)
  else if (colSpan === 9)
    classList.push(`lg:col-span-9`)
  else if (colSpan === 12)
    classList.push(``)

  if (rowSpan === 1)
    classList.push(`row-span-1`)
  else if (rowSpan === 2)
    classList.push(`row-span-2`)
  else if (rowSpan === 3)
    classList.push(`row-span-3`)
  else if (rowSpan === 4)
    classList.push(`row-span-4`)
  else if (rowSpan === 5)
    classList.push(`row-span-5`)
  else if (rowSpan === 6)
    classList.push(`row-span-6`)

  return { widgetComponent, classes: `col-span-12 ${classList.join(' ')}` }
},
)

const widgetTitle = vue.computed(() => props.title || props.widget?.title.value)
const widgetDescription = vue.computed(
  () => props.description || props.widget?.description.value,
)
</script>

<template>
  <div
    class="drop-target border-theme-300 bg-theme-0 relative flex flex-col rounded-md border transition-all"
    :class="[
      factorDashboard.domSelectors.widget,
      widgetLayout?.classes,
      editable ? 'shadow-md' : '',
    ]"
    :draggable="editable"
    :wid="widget?.hashId.value"
    :data-sql="widgetSql"
  >
    <div
      class="border-theme-200 text-theme-600 flex items-baseline justify-between border-b p-2 text-sm"
      :class="editable ? 'cursor-move ' : ''"
      :data-hash="widget?.hashId.value"
    >
      <div class="relative flex items-center px-2">
        <div class="font-bold">
          {{ widgetTitle }}
        </div>

        <div v-if="widgetDescription" class="description group relative ml-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="text-theme-300 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div
            class="pointer-events-none absolute top-0 left-full z-10 w-40 rounded-md bg-white p-3 text-xs opacity-0 shadow-md ring-1 ring-black/5 group-hover:opacity-100"
          >
            {{ widgetDescription }}
          </div>
        </div>
      </div>

      <div
        v-if="widgetActions && widgetActions.length"
        class="flex items-end justify-end space-x-2 text-base"
      >
        <ElButton
          v-for="(action, i) in widgetActions"
          :key="i"
          size="md"
          :btn="action.btn || 'default'"
          :loading="action.loading"
          :href="action.href || action.route?.value"
          @click="action.onClick ? action.onClick($event, action) : ''"
        >
          {{ action.name }}
        </ElButton>
      </div>
    </div>

    <div
      v-if="!widget || loading || widget?.loading.value"
      class="flex justify-center p-8"
    >
      <div class="text-theme-300 h-6 w-6">
        <ElSpinner />
      </div>
    </div>
    <div v-else-if="widget?.errorMessage.value" class="flex justify-center p-8">
      <div
        class="text-theme-500 pt-12 pb-8 text-center text-xs font-semibold uppercase tracking-wide text-opacity-40"
      >
        {{
          widget.errorMessage
            ? `Data Error: ${widget.errorMessage.value}`
            : "No Data"
        }}
      </div>
    </div>
    <div v-else class="no-scrollbar min-h-0 grow overflow-scroll">
      <slot />
    </div>
  </div>
</template>

<style lang="less">
.widget.drag * {
  pointer-events: none;
}
</style>
