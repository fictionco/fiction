<script lang="ts" setup>
import ElInput from '@factor/ui/ElInput.vue'
import { vue } from '@factor/api'
import ElButton from '../../ui/ElButton.vue'
import ElPanel from '../../ui/ElPanel.vue'
import { useKaption } from '../../utils'
import ReplayWrap from './ReplayWrap.vue'

const { kaptionEvents } = useKaption()
const form = vue.ref<{
  recordingTriggersStandard: string[]
  recordingTriggers: string[]
  recordingTriggerTime: number
  recordingEnabled: boolean
}>({
  recordingEnabled: true,
  recordingTriggers: [],
  recordingTriggersStandard: [],
  recordingTriggerTime: 20,
})
const sending = vue.ref(false)
async function send() {}
</script>

<template>
  <ReplayWrap>
    <template #actions>
      <ElButton
        btn="primary"
        :loading="sending"
        @click="send()"
      >
        Save Changes
      </ElButton>
    </template>

    <ElPanel title="Session Replay">
      <div class="max-w-prose px-4 lg:px-8">
        <ElInput
          v-model="form.recordingEnabled"
          class="my-8"
          label="Enable Session Recording"
          description="If enabled, sessions will be recorded"
          input="InputToggle"
          text-on="Recording Enabled"
          text-off="Recording Disabled"
        />

        <ElInput
          v-model="form.recordingTriggers"
          class="my-8"
          label="Recording Trigger Events - Custom"
          description="Trigger session recordings with your custom events"
          input="InputSelectMulti"
          :list="kaptionEvents.activeSelectEvents.value"
        />

        <ElInput
          v-model="form.recordingTriggersStandard"
          class="my-8"
          label="General Triggers"
          description="Record on general parameters. (Careful as these may override more specific triggers.)"
          input="InputCheckboxMulti"
          :list="[
            { name: `Record on any conversion`, value: 'macro' },
            { name: `Record on any goal (minor conversion)`, value: 'micro' },
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
            {
              name: `Record once a session reaches a minimum time...`,
              value: 'duration',
            },
          ]"
        />

        <ElInput
          v-model="form.recordingTriggerTime"
          class="my-8"
          label="Replay Recording Duration Minimum (Seconds)"
          description="Save a recording once a user visit reaches a specific duration. Default is 20 seconds."
          input="InputNumber"
          min="10"
          max="300"
        />
      </div>
    </ElPanel>
  </ReplayWrap>
</template>
