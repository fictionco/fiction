<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { FrameUtility } from '@fiction/ui/frame/elBrowserFrameUtil.js'
import type { Post } from '../post.js'
import { toLabel, useService, vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import ElBrowserFrameDevice from '@fiction/ui/frame/ElBrowserFrameDevice.vue'
import { getPostPreviewRoute } from '../utils/links.js'

defineOptions({ name: 'PostPreview' })

const { post, card } = defineProps<{
  post?: Post
  card: Card
}>()

const emit = defineEmits<{
  (event: 'update:post', payload: Post): void
}>()

const frameRef = vue.ref<HTMLElement & { frameUtility: FrameUtility }>() // Reference to the child component

const service = useService()

const deviceModes = [
  { name: 'desktop', icon: 'i-tabler-device-desktop', wrapClass: 'w-full' },
  { name: 'mobile', icon: 'i-tabler-device-mobile', wrapClass: 'w-[60%] max-w-sm' },
  { name: 'tablet', icon: 'i-tabler-device-ipad', wrapClass: 'w-[85%] max-w-xl' },
  { name: 'landscape', icon: 'i-tabler-device-ipad-horizontal', wrapClass: 'w-[90%] max-w-2xl' },
] as const

type DeviceMode = typeof deviceModes[number]['name']
const activeDeviceMode = vue.ref<DeviceMode>('desktop')
const deviceModeConfig = vue.computed(() => deviceModes.find(mode => mode.name === activeDeviceMode.value))
</script>

<template>
  <div v-if="post" class="h-full max-w-screen-xl mx-auto">
    <div class="p-6 flex flex-col gap-8 h-full">
      <div class="flex items-center gap-2">
        <XButton
          v-for="(mode, i) in deviceModes"
          :key="i"
          rounding="full"
          respond="icon:xl"
          :theme="activeDeviceMode === mode.name ? 'theme' : 'default'"
          :icon="mode.icon"
          size="xs"
          @click.stop="activeDeviceMode = mode.name"
        >
          {{ toLabel(mode.name) }}
        </XButton>
      </div>
      <div class="min-h-0 h-full relative mx-auto pb-10 flex flex-col" :class="deviceModeConfig?.wrapClass">
        <ElBrowserFrameDevice
          ref="frameRef"
          :device-mode="activeDeviceMode"
          class="rounded-md shadow-lg border border-theme-200"
          :url="getPostPreviewRoute({ post, card })"
          frame-id="post-preview-iframe"
          :browser-bar="false"
        />
      </div>
    </div>
  </div>
</template>
