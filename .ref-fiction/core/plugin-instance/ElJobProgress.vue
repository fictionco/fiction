<script lang="ts" setup>
import { vue } from '@factor/api'
import ElProgress from '@factor/ui/ElProgress.vue'
import ElPanel from '@factor/ui/ElPanel.vue'
import ElSpinner from '@factor/ui/ElSpinner.vue'
import { useFictionApp } from '../util'

const props = defineProps({
  progressIds: { type: Array as vue.PropType<string[]>, default: () => [] },
  ui: { type: String as vue.PropType<'panel' | 'naked'>, default: 'panel' },
  showWaiting: { type: String, default: '' },
})

const { fictionInstance } = useFictionApp()

const job = vue.computed(() => {
  const j = fictionInstance.activeJob.value

  if (!j || !j.progressId)
    return { percent: 0 }

  return props.progressIds.includes(j.progressId) ? j : { percent: 0 }
})

const title = vue.computed(() => {
  const j = job.value
  if (!j)
    return
  const t = j.title || 'Server Progress'

  return `${t} - In background, you can leave this page`
})

const jobInProcess = vue.computed(() => {
  const j = job.value
  return j && j.percent && j.status === 'processing'
})
</script>

<template>
  <div v-if="jobInProcess || showWaiting">
    <template v-if="ui === 'naked'">
      <ElProgress
        :percent="job.percent"
        :message="job.message || 'Processing...'"
        :title="title"
      />
    </template>
    <template v-else>
      <ElPanel box-class="px-4">
        <div
          v-if="!jobInProcess"
          class="text-theme-300 flex items-center justify-between space-x-4 p-4 text-center text-sm font-bold"
        >
          <div>{{ showWaiting }}</div>
          <ElSpinner class="h-4 w-4" />
        </div>
        <ElProgress
          v-else
          :percent="job.percent"
          :message="job.message || 'Processing...'"
          :title="title"
        />
      </ElPanel>
    </template>
  </div>
</template>
