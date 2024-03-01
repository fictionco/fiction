<script lang="ts" setup>
import { onEvent, vue } from '@factor/api'
import { useKaption } from '@kaption/core/utils'
import ElButton from '@kaption/core/ui/ElButton.vue'
import type { ClientWidget, PortableWidget } from '@kaption/core/plugin-dashboards/widget'

import DashboardWrap from '@kaption/core/plugin-dashboards/app/DashboardWrap.vue'
import { DragDropGrid } from '@kaption/core/plugin-dashboards/app/dragDropUtility'
import DashboardEditWidget from '@kaption/core/plugin-dashboards/app/DashboardEditWidget.vue'
import DashboardNewWidget from '@kaption/core/plugin-dashboards/app/DashboardNewWidget.vue'
import DashboardNew from '@kaption/core/plugin-dashboards/app/DashboardNew.vue'

const { kaptionDashboard, factorRouter } = useKaption()
const activeDashboard = kaptionDashboard.activeDashboard
const domSelectors = kaptionDashboard.domSelectors

const editWidgetVisible = vue.ref(false)
const editWidgetConfig = vue.ref<ClientWidget>()

const pageComponent = vue.computed(() => {
  const comp = kaptionDashboard.activeDashboard.value?.pageComponent
  return comp || vue.defineAsyncComponent(() => import(`./DashboardPage.vue`))
})

type EditModes = '' | 'on' | 'off' | 'revert'

const newWidget = vue.ref(false)
const editMode = vue.ref<EditModes>('')
const newPanel = vue.ref(false)
const sending = vue.ref<string | boolean>(false)
const dragDropWidgets = new DragDropGrid({ kaptionDashboard })
vue.watch(
  () => editMode.value,
  (val) => {
    if (val === 'on')
      dragDropWidgets.enable()
  },
)

function editWidget(widgetConfig: ClientWidget): void {
  editWidgetConfig.value = widgetConfig
  editWidgetVisible.value = true
}

// sent from child components
onEvent('editDashboard', (val: EditModes) => (editMode.value = val))
onEvent('editWidget', (val: ClientWidget) => editWidget(val))
onEvent('widgetLayout', () => {
  const sortableGrid = document.querySelector(`#${domSelectors.grid}`)
  const ws = sortableGrid?.querySelectorAll(`.${domSelectors.widget}`)
  if (!ws)
    return

  const arr = [...ws]
  const layoutHashIds = arr.map(el => el.getAttribute(domSelectors.widgetId))

  // replace with widgets for dashboard layout
  const newLayout = layoutHashIds
    .map((wid) => {
      const w = kaptionDashboard.activeLayout.value.find(
        w => w.hashId.value === wid,
      )
      if (!w)
        return
      return { widgetKey: w.widgetKey }
    })
    .filter(Boolean) as PortableWidget[]

  activeDashboard.value.layout = newLayout
  kaptionDashboard.activeDashboard.value = activeDashboard.value
})

async function manageDashboard(_action: 'delete' | 'update'): Promise<void> {
  if (_action === 'delete') {
    const confirmed = confirm('Are you sure?')

    if (confirmed) {
      sending.value = 'delete'
      const { dashboardId, dashboardType } = activeDashboard.value
      const r = await kaptionDashboard.requestManageDashboard({
        _action,
        dashboardId,
      })

      sending.value = false
      if (r.status === 'success') {
        if (dashboardType === 'user')
          await factorRouter.router.push('/')
        else location.reload()
      }
    }
  }
  else if (_action === 'update') {
    sending.value = 'save'

    const { dashboardId, layout } = activeDashboard.value

    const r = await kaptionDashboard.requestManageDashboard({
      _action,
      dashboardId,
      layout,
    })

    if (r.status === 'success')
      editMode.value = 'off'
  }
  sending.value = false
}

function manageWidget(_action: 'add' | 'update', w: PortableWidget): void {
  const current = activeDashboard.value

  let newLayout: PortableWidget[] = []
  if (_action === 'add') {
    newLayout = [w, ...current.layout]
  }
  else if (_action === 'update') {
    newLayout = current.layout.map((l) => {
      return l.hashId === w.hashId ? w : l
    })
  }

  activeDashboard.value.layout = newLayout
  kaptionDashboard.activeDashboard.value = activeDashboard.value
}
</script>

<template>
  <DashboardWrap>
    <template #actions>
      <div class="flex space-x-3">
        <template v-if="editMode === 'on'">
          <ElButton
            btn="default"
            size="sm"
            @click="editMode = 'off'"
          >
            Cancel
          </ElButton>
          <ElButton
            btn="default"
            size="sm"
            :loading="sending === 'delete'"
            @click="manageDashboard('delete')"
          >
            <span v-if="activeDashboard.dashboardType === 'user'">Delete Dashboard</span><span v-else>Reset to Default</span>
          </ElButton>

          <ElButton
            btn="default"
            size="sm"
            @click.prevent.stop="newWidget = true"
          >
            Add Widget
          </ElButton>
          <ElButton
            btn="primary"
            size="sm"
            :loading="sending === 'save'"
            @click="manageDashboard('update')"
          >
            Save Changes
          </ElButton>
        </template>
        <template v-else>
          <ElButton
            size="sm"
            class="hidden lg:inline-flex"
            btn="default"
            @click="editMode = 'on'"
          >
            Edit Dashboard
          </ElButton>
          <ElButton
            size="sm"
            btn="default"
            class="hidden lg:block"
            @click.stop="newPanel = true"
          >
            Add New Dashboard
          </ElButton>
        </template>
      </div>
    </template>
    <component :is="pageComponent" :edit-mode="editMode" />

    <DashboardNew v-model:vis="newPanel" />
    <DashboardNewWidget
      v-model:vis="newWidget"
      @add="manageWidget('add', $event)"
    />
    <DashboardEditWidget
      v-model:vis="editWidgetVisible"
      :widget="editWidgetConfig"
      @update="manageWidget('update', $event)"
    />
  </DashboardWrap>
</template>
