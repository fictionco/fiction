<script lang="ts" setup>
import { vue } from '@factor/api'
import type { ClientWidget, DataCompared } from '@factor/api/plugin-dashboards'
import { useKaption } from '../../utils'
import type { ClickEvent } from '../types'
import ElBrowser from '../../ui/ElBrowser.vue'
import type { FrameUtility } from '../../ui/elBrowserFrameUtil'
import ElButton from '../../ui/ElButton.vue'
import ElZeroState from '../../ui/ElZeroState.vue'

const props = defineProps({
  widget: {
    type: Object as vue.PropType<ClientWidget<DataCompared<ClickEvent>>>,
    required: true,
  },
})
const { factorAdmin, factorRouter } = useKaption()
const activeProject = factorAdmin.activeProject

const origins = vue.computed<string[]>(() => {
  const project = activeProject.value
  if (!project)
    return []
  return project.origins || []
})

const fetching = vue.ref(true)

const data = vue.computed<ClickEvent[] | undefined>(() => {
  return props.widget.data.value?.main
})

let stopWatch: vue.WatchStopHandle
function startSendingData(frameUtility: FrameUtility) {
  fetching.value = false

  if (stopWatch)
    stopWatch()

  const sendData = (): void => {
    const message = {
      messageType: 'setHeatmap',
      data: data.value,
    }

    frameUtility.sendMessage({ message })
  }

  stopWatch = vue.watch(
    () => data.value,
    (v) => {
      if (v)
        sendData()
    },
    { immediate: true, deep: true },
  )
}
</script>

<template>
  <div v-if="!origins || origins.length === 0">
    <ElZeroState
      title="No Websites in Project"
      note="Add your website to the project to load it here."
    >
      <template #action>
        <ElButton btn="primary" :to="factorRouter.link('projectSettings').value">
          Project Settings &rarr;
        </ElButton>
      </template>
    </ElZeroState>
  </div>

  <ElBrowser
    v-else
    :origins="origins"
    @load="startSendingData($event)"
  />
</template>
