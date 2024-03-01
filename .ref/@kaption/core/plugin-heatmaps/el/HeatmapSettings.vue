<script lang="ts" setup>
import ElInput from '@factor/ui/ElInput.vue'
import { vue } from '@factor/api'
import ElButton from '../../ui/ElButton.vue'
import ElPanel from '../../ui/ElPanel.vue'
import { useKaption } from '../../utils'
import HeatmapWrap from './HeatmapWrap.vue'

const { kaptionEvents } = useKaption()
const form = vue.ref<{
  clickTrackingEnabled: boolean
  clickThrottleSeconds: number
}>({
  clickTrackingEnabled: true,
  clickThrottleSeconds: 5,
})
const sending = vue.ref(false)
async function send() {}
</script>

<template>
  <HeatmapWrap>
    <template #actions>
      <ElButton
        btn="primary"
        :loading="sending"
        @click="send()"
      >
        Save Changes
      </ElButton>
    </template>

    <ElPanel title="Heatmap Settings">
      <div class="max-w-prose px-4 lg:px-8">
        <ElInput
          v-model="form.clickTrackingEnabled"
          class="my-8"
          label="Enable Click Tracking"
          input="InputToggle"
          text-on="Click Tracking Enabled"
          text-off="Click Tracking Disabled"
        />
      </div>
    </ElPanel>
  </HeatmapWrap>
</template>
