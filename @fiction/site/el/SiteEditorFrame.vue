<script lang="ts" setup>
import { vue } from '@fiction/core'
import ElBrowserFrameDevice from '@fiction/ui/ElBrowserFrameDevice.vue'
import type { FrameUtility } from '@fiction/ui/elBrowserFrameUtil'
import type { Site } from '../site'
import type { FramePostMessageList } from '../utils/frame'

const props = defineProps({
  site: { type: Object as vue.PropType<Site>, default: undefined },
})

const frameRef = vue.ref<HTMLElement & { frameUtility: FrameUtility<FramePostMessageList> }>() // Reference to the child component

const deviceModes = [
  { name: 'desktop', icon: 'i-tabler-device-desktop', wrapClass: 'w-full' },
  { name: 'mobile', icon: 'i-tabler-device-mobile', wrapClass: 'w-[60%] max-w-xs' },
  { name: 'tablet', icon: 'i-tabler-device-ipad', wrapClass: 'w-[85%] max-w-md' },
  { name: 'landscape', icon: 'i-tabler-device-ipad-horizontal', wrapClass: 'w-[85%] max-w-lg' },
] as const

type DeviceMode = typeof deviceModes[number]['name']
const activeDeviceMode = vue.ref<DeviceMode>('desktop')
const deviceModeConfig = vue.computed(() => deviceModes.find(mode => mode.name === activeDeviceMode.value))

// Watch for changes in frameRef and assign frameUtility
vue.watch(
  frameRef,
  (newValue) => {
    if (newValue && props.site)
      props.site.frame.setUtil(newValue.frameUtility)
  },
  { immediate: true },
)
</script>

<template>
  <div v-if="site" class="min-h-0 p-4">
    <div
      class="relative mx-auto py-4"
      :class="deviceModeConfig?.wrapClass"
    >
      <ElBrowserFrameDevice
        ref="frameRef"
        :device-mode="activeDeviceMode"
        class="rounded-md shadow-lg border border-theme-200"
        :url="site.frame.frameUrl.value"
        frame-id="site-builder-iframe"
        :display-url="site.frame.displayUrl.value"
        :browser-bar="true"
        @update:url="site.frame.updateFrameUrl($event)"
        @message="site.frame.processFrameMessage({ scope: 'parent', msg: $event as FramePostMessageList })"
      />
      <div
        class="mt-4 flex justify-center space-x-2 "
      >
        <div
          v-for="(mode, i) in deviceModes"
          :key="i"
          class="inline-flex cursor-pointer select-none items-center rounded px-2 py-1 font-semibold space-x-1"
          :class="activeDeviceMode === mode.name
            ? 'bg-theme-500 dark:bg-theme-500 text-theme-0 dark:text-theme-0'
            : 'text-theme-500 dark:text-theme-100 bg-theme-100 dark:bg-theme-700 hover:text-white hover:bg-primary-500'
          "
          @click.stop="activeDeviceMode = mode.name"
        >
          <div class="text-xl">
            <div :class="mode.icon" />
          </div>
          <div class="capitalize tracking-tight text-[10px]">
            {{ mode.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
