<script lang="ts" setup>
import ElInput from '@factor/ui/ElInput.vue'
import { vue } from '@factor/api'
import ElButton from '../../ui/ElButton.vue'
import ElPanel from '../../ui/ElPanel.vue'
import { useKaption } from '../../utils'
import InputBlockIp from '../../../../@factor/ui/InputBlockIp.vue'
import type { ProjectWithAnalytics } from '../types'
import PageWrap from './PageWrap.vue'

const { kaptionEvents, factorAdmin } = useKaption()
const activeProject = factorAdmin.activeProject

const sending = vue.ref<string | boolean>(false)
const sent = vue.ref(false)

let form = vue.reactive<Partial<ProjectWithAnalytics>>({})
vue.watch(
  () => activeProject.value,
  (v) => {
    if (v)
      form = vue.reactive<Partial<ProjectWithAnalytics>>(v)
  },
  { immediate: true },
)

async function updateProject(): Promise<void> {
  if (!form.projectId)
    throw new Error('no project id')

  await factorAdmin.requests.ManageProject.request({
    _action: 'update',
    projectId: form.projectId,
    project: form,
  })
}

async function send(): Promise<void> {
  sending.value = true
  await updateProject()
  sent.value = true
  sending.value = false
}
</script>

<template>
  <PageWrap>
    <template #actions>
      <ElButton
        btn="primary"
        :loading="sending"
        @click="send()"
      >
        Save Changes
      </ElButton>
    </template>

    <ElPanel title="Tracking Settings">
      <div class="max-w-prose px-4 lg:px-8">
        <ElInput
          v-model="form.shouldValidateOrigin"
          class="my-8"
          label="Tracking Domain Validation"
          description="Sessions will be recorded only if domain matches with configuration"
          input="InputToggle"
          text-on="Validation On"
          text-off="Validation Off"
        />

        <ElInput
          class="my-8"
          label="Block IP Addresses"
          description="Completely block tracking from the following IP addresses"
        >
          <InputBlockIp v-model="form.blockIps" />
        </ElInput>
      </div>
    </ElPanel>
    <ElPanel title="Session Replay">
      <div class="max-w-prose px-4 lg:px-8">
        <ElInput
          v-model="form.recordingTriggers"
          class="my-8"
          label="All Trigger Events - Custom"
          description="Which custom events should trigger a session recording?"
          input="InputSelectMulti"
          :list="kaptionEvents.activeSelectEvents.value"
        />

        <ElInput
          v-model="form.recordingTriggers"
          class="my-8"
          label="Standard Recording Trigger Events"
          description="Record on general parameters. (Careful as these may override more specific triggers.)"
          input="InputCheckboxMulti"
          :list="[
            { name: `Record on any conversion`, value: 'conversion' },
            {
              name: `Record on any conversion or goal (minor conversion)`,
              value: 'goal',
            },
            {
              name: `Record sessions detected as headless bots`,
              value: 'bot',
            },
            {
              name: `Record sessions with 'rage clicks'`,
              value: 'rageClick',
            },
            {
              name: `Record sessions with error events`,
              value: 'error',
            },
          ]"
        />

        <ElInput
          v-model="form.recordingMinimumDuration"
          class="my-8"
          label="Replay Recording Duration Minimum (Seconds)"
          description="Save a recording once a user visit reaches a specific duration. Default is 20 seconds."
          input="InputNumber"
          min="10"
          max="300"
        />
      </div>
    </ElPanel>
  </PageWrap>
</template>
