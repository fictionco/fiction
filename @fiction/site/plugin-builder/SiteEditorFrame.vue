<script lang="ts" setup>
import { toLabel, vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import ElTooltip from '@fiction/ui/common/ElTooltip.vue'
import ElBrowserFrameDevice from '@fiction/ui/frame/ElBrowserFrameDevice.vue'
import type { FrameUtility } from '@fiction/ui/frame/elBrowserFrameUtil'
import type { Site } from '../site'
import type { FramePostMessageList } from '../utils/frame'

const props = defineProps({
  site: { type: Object as vue.PropType<Site>, default: undefined },
})

const frameRef = vue.ref<HTMLElement & { frameUtility: FrameUtility<FramePostMessageList> }>() // Reference to the child component

const deviceModes = [
  { name: 'desktop', icon: 'i-tabler-device-desktop', wrapClass: 'w-full' },
  { name: 'mobile', icon: 'i-tabler-device-mobile', wrapClass: 'w-[60%] max-w-sm' },
  { name: 'tablet', icon: 'i-tabler-device-ipad', wrapClass: 'w-[85%] max-w-xl' },
  { name: 'landscape', icon: 'i-tabler-device-ipad-horizontal', wrapClass: 'w-[90%] max-w-2xl' },
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

function toggleDarkLightMode() {
  if (!props.site)
    return
  const v = !props.site.isLightMode.value
  props.site.isLightMode.value = v

  props.site.frame.syncSite({ caller: 'updateDarkLightMode' })
}

function toggleEditingStyle() {
  if (!props.site)
    return
  const v = props.site.editor.value.savedEditingStyle === 'quick' ? 'clean' : 'quick'
  props.site.editor.value.savedEditingStyle = v

  props.site.frame.syncSite({ caller: 'updateEditingStyle' })
}
</script>

<template>
  <div class="space-y-4 p-4">
    <div
      v-if="site"
      class=" flex justify-between space-x-2 "
    >
      <div class="flex items-center gap-2">
        <XButton
          v-for="(mode, i) in deviceModes"
          :key="i"
          rounding="full"

          :theme="activeDeviceMode === mode.name ? 'theme' : 'default'"
          :icon="mode.icon"
          size="xs"

          @click.stop="activeDeviceMode = mode.name"
        >
          {{ toLabel(mode.name) }}
        </XButton>
      </div>

      <div class="flex items-center gap-2">
        <XButton
          rounding="full"
          :icon="site.isLightMode.value ? 'i-tabler-moon' : 'i-tabler-sun'"
          size="xs"
          @click="toggleDarkLightMode()"
        >
          {{ site.isLightMode.value ? 'Light' : 'Dark' }}
        </XButton>

        <ElTooltip
          direction="bottom"
          :content="site.editor.value.savedEditingStyle === 'quick'
            ? 'Quick Editing: Editing on by default, hold &#8984; to make site behave normally'
            : 'Clean Editing: Site has normal behavior by default, hold &#8984; to activate editing'"
        >
          <XButton
            rounding="full"
            size="xs"
            icon="i-tabler-drag-drop"
            @click="toggleEditingStyle()"
          >
            {{ site.editor.value.savedEditingStyle === 'quick' ? 'Quick Edit' : 'Clean Edit' }}
          </XButton>
        </ElTooltip>
      </div>
    </div>
    <div v-if="site" class="min-h-0 h-full relative mx-auto pb-10 flex flex-col" :class="deviceModeConfig?.wrapClass">
      <ElBrowserFrameDevice
        ref="frameRef"
        :device-mode="activeDeviceMode"
        class="rounded-md shadow-lg border border-theme-200"
        :url="site.frame.frameUrl.value"
        frame-id="site-builder-iframe"
        :display-url="site.frame.displayUrl.value"
        :browser-bar="true"
        @update:url="site?.frame.updateFrameUrl($event)"
        @message="site?.frame.processFrameMessage({ scope: 'parent', msg: $event as FramePostMessageList })"
      />
    </div>
  </div>
</template>
