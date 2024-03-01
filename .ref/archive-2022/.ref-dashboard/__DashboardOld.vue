<script lang="ts" setup>
import type {
  Component as VueComponent,
} from 'vue'
import {
  computed,
  defineAsyncComponent as def,
  onMounted,
  ref,
  watch,
} from 'vue'
import ElButton from '@kaption/core/ui/ElButton.vue'

import {
  DataEngine,
  activeLayoutMap,
  activeSelectedDashboard,
} from '@kaption/core/dataEngine'

import { useRouter } from 'vue-router'
import type { DashboardLayout, WidgetConfigUser } from '@kaption/core/types'
import { emitEvent, fastHash, onEvent, storeItem, stored, userInitialized } from '@factor/api'
import { endpointsMap } from '@kaption/core/plugin-dashboards/endpoint'
import DashboardWrap from '@kaption/core/plugin-dashboards/app/DashboardWrap.vue'
import DashboardEditWidget from '@kaption/core/plugin-dashboards/app/DashboardEditWidget.vue'
import DashboardNewWidget from '@kaption/core/plugin-dashboards/app/DashboardNewWidget.vue'
import DashboardNew from '@kaption/core/plugin-dashboards/app/DashboardNew.vue'
import { dragDrop } from '@kaption/core/plugin-dashboards/app/dashboardDragDrop'

type EditModes = 'start' | 'end' | 'revert'

const router = useRouter()
const newPanel = ref(false)
const newWidget = ref(false)
const sending = ref<string | boolean>(false)

const editWidgetVisible = ref(false)
const editWidgetConfig = ref<WidgetConfigUser>()
const isCustom = computed(
  () => activeSelectedDashboard.value.isCustomized || false,
)
const editModeActive = ref(false)

const pageComponent = computed<VueComponent>(() => {
  const comp = activeSelectedDashboard.value.pageComponent as VueComponent

  return comp || def(() => import(`@kaption/core/plugin-dashboards/app/DashboardPage.vue`))
})

function editMode(mode: EditModes): void {
  editModeActive.value = mode === 'start'
  dragDrop(mode)
}

onEvent('newWidget', () => (newWidget.value = true))
onEvent('editDashboard', (_: EditModes) => editMode(_))

// when widget layout changes, save to selected dash
onEvent('widgetLayout', () => {
  const sortableGrid = document.querySelector('#sortableGrid')
  const ws = sortableGrid?.querySelectorAll('.widget')
  if (!ws)
    return

  const arr = Array.from(ws)
  const widgetIds = arr.map(el => el.getAttribute('wid'))
  const current = activeSelectedDashboard.value

  const newLayout = widgetIds
    .map((wid) => {
      return current.layout.find(w => w.widgetId === wid)
    })
    .filter(Boolean) as WidgetConfigUser[]

  activeSelectedDashboard.value = { ...current, layout: newLayout }
})

let setDashboard: DashboardLayout | undefined

function isDifferentDashboard(newDashboard: DashboardLayout): boolean {
  if (
    !setDashboard
    || newDashboard.dashboardId !== setDashboard.dashboardId
    || (editModeActive.value
    && fastHash(newDashboard.layout) !== fastHash(setDashboard.layout))
  )
    return true
  else
    return false
}

function setFullLayout(dash: DashboardLayout): void {
  const layoutConfig = dash.layout ?? []

  DataEngine.layoutDataEngine(layoutConfig)
}

onMounted(async () => {
  await userInitialized()

  watch(
    () => activeSelectedDashboard.value,
    (v: DashboardLayout<WidgetConfigUser>) => {
      if (v && isDifferentDashboard(v)) {
        if (v.dashboardId !== setDashboard?.dashboardId)
          editMode('end')

        setDashboard = activeSelectedDashboard.value

        setFullLayout(v)
      }
    },
    { immediate: true },
  )
})

function addWidget(widgetConfig: WidgetConfigUser): void {
  const current = activeSelectedDashboard.value

  const newLayout: WidgetConfigUser[] = [widgetConfig, ...current.layout]

  activeSelectedDashboard.value = { ...current, layout: newLayout }
}

function editWidget(widgetConfig: WidgetConfigUser): void {
  editWidgetConfig.value = widgetConfig
  editWidgetVisible.value = true
}

onEvent('editWidget', (_: WidgetConfigUser) => editWidget(_))

function updateWidget(w: WidgetConfigUser): void {
  const current = activeSelectedDashboard.value

  const newLayout = current.layout.map((l) => {
    return l.widgetId === w.widgetId ? w : l
  })

  activeSelectedDashboard.value = { ...current, layout: newLayout }
}

async function deleteDashboard(isCustom: boolean): Promise<void> {
  const confirmed = confirm('Are you sure?')

  if (confirmed) {
    sending.value = 'delete'
    const { dashboardId } = activeSelectedDashboard.value

    const r = await endpointsMap.ManageCustomDashboard.projectRequest({
      _action: 'delete',
      dashboardId,
      isCustom,
    })
    sending.value = false
    if (r.status === 'success') {
      if (isCustom)
        await router.push('/')
      else
        location.reload()
    }
  }
}

async function saveDashboard(): Promise<void> {
  sending.value = 'save'

  const { dashboardId, layout } = activeSelectedDashboard.value

  const r = await endpointsMap.ManageCustomDashboard.projectRequest({
    _action: 'update',
    dashboardId,
    layout,
  })

  if (r.status === 'success')
    editMode('end')

  sending.value = false
}
</script>

<template>
  <DashboardWrap title="Dashboard">
    <template #actions>
      <template v-if="editModeActive">
        <ElButton btn="default" @click="editMode('end')">
          Cancel
        </ElButton>
        <ElButton
          btn="default"
          :loading="sending === 'delete'"
          @click="deleteDashboard(isCustom)"
        >
          <span v-if="isCustom">Delete Dashboard</span><span v-else>Reset to Default</span>
        </ElButton>

        <ElButton btn="default" @click.prevent.stop="emitEvent('newWidget')">
          Add Widget
        </ElButton>
        <ElButton
          btn="primary"
          :loading="sending === 'save'"
          @click="saveDashboard()"
        >
          Save Changes
        </ElButton>
        <ElButton
          btn="default"
          class="hidden lg:inline-flex"
          @click.stop="newPanel = true"
        >
          Add New Dashboard
        </ElButton>
      </template>
      <template v-else>
        <ElButton
          class="hidden md:inline-flex"
          btn="default"
          @click="editMode('start')"
        >
          Edit Dashboard
        </ElButton>

        <ElButton
          btn="default"
          class="inline-block md:hidden"
          :class="stored('controlsMobileVis') ? 'bg-slate-50' : ''"
          @click.stop="
            storeItem('controlsMobileVis', !stored('controlsMobileVis'))
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-slate-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>

          <span class="ml-2">Dates </span>
        </ElButton>
      </template>
    </template>

    <component
      :is="pageComponent"
      :layout="activeLayoutMap"
      :edit-mode-active="editModeActive"
      :is-custom="isCustom"
    />

    <DashboardNew v-model:vis="newPanel" />
    <DashboardNewWidget v-model:vis="newWidget" @add="addWidget($event)" />
    <DashboardEditWidget
      v-model:vis="editWidgetVisible"
      :config="editWidgetConfig"
      @update="updateWidget($event)"
    />
  </DashboardWrap>
</template>

<style lang="less">
.custom-grid {
  grid-auto-flow: dense;
  grid-auto-rows: 15.5rem;
}
</style>
