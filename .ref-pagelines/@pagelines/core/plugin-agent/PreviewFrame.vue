<script lang="ts" setup>
import { throttle, vue } from '@factor/api'
import ElDeviceFrame from '@factor/ui/ElBrowserFrameDevice.vue'
import type { ChatAgent } from './obj'

const props = defineProps({
  agent: {
    type: Object as vue.PropType<ChatAgent>,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  url: {
    type: String,
    default: '',
  },
})
const frameEl = vue.shallowRef<InstanceType<typeof ElDeviceFrame>>()

vue.onMounted(async () => {
  vue.watch(
    () => props.agent?.options.value,
    throttle(async () => {
      sendAgentToFrame()
    }, 2000),
    { deep: true, immediate: true },
  )
})

function setFrameUtility() {
  sendAgentToFrame()
}

function sendAgentToFrame() {
  if (frameEl.value) {
    const frameUtil = frameEl.value.frameUtility

    if (!frameUtil)
      throw new Error('no frame utility')

    const agentConfig = props.agent.toConfig()
    frameUtil?.sendMessage({
      message: { messageType: 'setAgent', data: agentConfig },
    })
  }
}
</script>

<template>
  <div :key="url">
    <div class="font-brand my-6">
      <div class="font-brand text-xl font-bold">
        Preview
      </div>
      <div>
        Based on your settings...
        <a
          :href="url"
          class="text-primary-500 italic"
          target="_blank"
        >View full screen &rarr;</a>
      </div>
    </div>
    <div class="border-theme-300 overflow-hidden rounded-md border shadow-md">
      <ElDeviceFrame
        ref="frameEl"
        device-mode="mobile"
        frame-id="embed-preview"
        :url="url"
        @frame-utility="setFrameUtility()"
      />
    </div>
  </div>
</template>
