<script lang="ts" setup>
import type { NavListItem } from '@fiction/core'
import type { FrameUtility } from '@fiction/ui/frame/elBrowserFrameUtil'
import type { Site } from '../site'
import type { FramePostMessageList } from '../utils/frame'
import { toLabel, vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import ElTooltip from '@fiction/ui/common/ElTooltip.vue'
import XDropDown from '@fiction/ui/common/XDropDown.vue'
import XText from '@fiction/ui/common/XText.vue'
import ElBrowserFrameDevice from '@fiction/ui/frame/ElBrowserFrameDevice.vue'
import XIcon from '@fiction/ui/media/XIcon.vue'
import XMedia from '@fiction/ui/media/XMedia.vue'

const props = defineProps({
  site: { type: Object as vue.PropType<Site>, default: undefined },
})

const frameRef = vue.ref<HTMLElement & { frameUtility: FrameUtility<FramePostMessageList> }>() // Reference to the child component

type DeviceModeKeys = 'desktop' | 'mobile' | 'tablet' | 'landscape'
const activeDeviceModeKey = vue.ref<DeviceMode>('desktop')
const deviceModes: (NavListItem & { wrapClass: string, value: DeviceModeKeys })[] = [
  { value: 'desktop', icon: { class: 'i-tabler-device-desktop' }, wrapClass: 'w-full' },
  { value: 'mobile', icon: { class: 'i-tabler-device-mobile' }, wrapClass: 'w-[60%] max-w-sm' },
  { value: 'tablet', icon: { class: 'i-tabler-device-ipad' }, wrapClass: 'w-[85%] max-w-xl' },
  { value: 'landscape', icon: { class: 'i-tabler-device-ipad-horizontal' }, wrapClass: 'w-[90%] max-w-2xl' },
]

const activeDeviceMode = vue.computed(() => deviceModes.find(mode => mode.value === activeDeviceModeKey.value) || deviceModes[0])

type DeviceMode = typeof deviceModes[number]['value']

const deviceModeConfig = vue.computed(() => deviceModes.find(mode => mode.value === activeDeviceModeKey.value))

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

  props.site.syncChange({ caller: 'updateDarkLightMode' })
}

const currentPage = vue.computed(() => props.site?.currentPage.value)
const currentPageStandard = vue.computed(() => currentPage.value?.userConfig.value.standard)
const isHome = vue.computed(() => { return currentPage.value?.slug.value === '_home' || currentPage.value?.slug.value === '' })
</script>

<template>
  <div class="space-y-4 p-4 lg:p-6">
    <div
      v-if="site"
      class=" flex justify-between space-x-2 "
    >
      <div class="flex items-center gap-2">
        <XDropDown
          v-model="activeDeviceModeKey"
          mode="click"
          :items="deviceModes"
        >
          <XButton
            rounding="full"
            :icon="activeDeviceMode?.icon"
            size="xs"
            icon-after="i-tabler-chevron-down"
          >
            {{ toLabel(activeDeviceMode?.value) }}
          </XButton>
        </XDropDown>
      </div>
      <div class="flex items-center gap-2">
        <ElTooltip
          direction="bottom"
          content="Undo the last change"
        >
          <XButton
            rounding="full"
            icon="i-tabler-arrow-back"
            size="xs"
            :disabled="!site.history.canUndo.value"
            respond="icon:xl"
            @click="site.history.undo()"
          />
        </ElTooltip>
        <ElTooltip
          direction="bottom"
          content="Redo the last undo"
        >
          <XButton
            rounding="full"
            icon="i-tabler-arrow-forward"
            size="xs"
            :disabled="!site.history.canRedo.value"
            respond="icon:xl"
            @click="site.history.redo()"
          />
        </ElTooltip>

        <ElTooltip
          direction="bottom"
          content="For previewing, to change the behavior see global styling options"
        >
          <XButton
            rounding="full"
            :icon="site.isLightMode.value ? 'i-tabler-sun' : 'i-tabler-moon'"
            size="xs"
            respond="icon:xl"
            @click="toggleDarkLightMode()"
          >
            {{ site.isLightMode.value ? 'Light' : 'Dark' }} Mode Preview
          </XButton>
        </ElTooltip>
      </div>
    </div>
    <div v-if="site" class="min-h-0 h-full relative mx-auto pb-10 flex flex-col" :class="deviceModeConfig?.wrapClass">
      <ElBrowserFrameDevice
        ref="frameRef"
        :device-mode="activeDeviceModeKey"
        class="rounded-md shadow-lg border border-theme-200"
        :url="site.frame.frameUrl.value"
        frame-id="site-builder-iframe"
        :display-url="site.frame.displayUrl.value"
        :browser-bar="true"
        @update:url="site?.frame.updateFrameUrl($event)"
        @message="site?.frame.processFrameMessage({ scope: 'parent', msg: $event as FramePostMessageList })"
      >
        <template #bar>
          <div class="flex items-center px-3 py-2 gap-3 border-b border-theme-200 dark:border-theme-600  bg-gradient-to-b dark:from-theme-700/50 dark:to-theme-700/50">
            <div class="flex items-center gap-2 text-xs ">
              <div class="flex items-center justify-center">
                <XMedia v-if="site.userConfig.value?.favicon" :media="site.userConfig.value?.favicon" />
                <XIcon class="size-5 text-theme-400 dark:text-theme-500" :media="{ class: 'i-tabler-file' }" />
              </div>
              <div class="font-semibold">
                {{ currentPageStandard?.title || currentPage?.title.value || 'Untitled Page' }}
              </div>
              <div>{{ currentPageStandard?.description || currentPage?.description.value }}</div>
            </div>
            <div class=" justify-between text-xs ">
              <div class="bg-theme-600/30 rounded-md flex items-center justify-between gap-2 py-1 px-3 font-mono">
                <div class="flex items-center gap-1">
                  <XText
                    :model-value="site.frame.displayUrl.value"
                    title="Current Path"
                    :is-editable="false"
                    class="whitespace-nowrap"
                  />
                  <div v-if="isHome" class="text-[10px] text-theme-400 dark:text-theme-400">
                    (Home Page)
                  </div>
                </div>
              </div>
            </div>
            <div class="grow flex justify-end">
              <XButton size="sm" design="ghost" icon="i-tabler-settings">
                Edit Page Settings
              </XButton>
            </div>
          </div>
        </template>
      </ElBrowserFrameDevice>
    </div>
  </div>
</template>
