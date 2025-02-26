<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { FrameUtility } from '@fiction/ui/frame/elBrowserFrameUtil.js'
import type { Post } from '../post.js'
import { toLabel, vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import ElBrowserFrameDevice from '@fiction/ui/frame/ElBrowserFrameDevice.vue'
import { getPostPreviewRoute } from '../utils/links.js'

defineOptions({ name: 'PostPreview' })

const { post, card } = defineProps<{
  post?: Post
  card: Card
}>()

const frameRef = vue.ref<HTMLElement & { frameUtility: FrameUtility }>() // Reference to the child component

const formatModes = [
  { label: 'browser', icon: 'i-tabler-browser', wrapClass: 'w-full' },
  { label: 'email', icon: 'i-tabler-mail', wrapClass: 'w-[60%] max-w-sm' },
] as const

const deviceModes = [
  { label: 'desktop', icon: 'i-tabler-device-desktop', wrapClass: 'w-full' },
  { label: 'mobile', icon: 'i-tabler-device-mobile', wrapClass: 'w-[60%] max-w-sm' },
  { label: 'tablet', icon: 'i-tabler-device-ipad', wrapClass: 'w-[85%] max-w-xl' },
  { label: 'landscape', icon: 'i-tabler-device-ipad-horizontal', wrapClass: 'w-[90%] max-w-2xl' },
] as const

type DeviceMode = typeof deviceModes[number]['label']
const activeDeviceMode = vue.ref<DeviceMode>('desktop')
const deviceModeConfig = vue.computed(() => deviceModes.find(mode => mode.label === activeDeviceMode.value))
const activeFormatMode = vue.ref<'browser' | 'email'>('browser')
</script>

<template>
  <div v-if="post" class="h-full max-w-screen-xl mx-auto">
    <div class="p-12 flex flex-col gap-8 h-full">
      <div class="flex justify-between items-center gap-4">
        <div class="flex items-center gap-2">
          <XButton
            v-for="(mode, i) in formatModes"
            :key="i"
            rounding="full"
            respond="icon:xl"
            design="outline"
            :theme="activeFormatMode === mode.label ? 'primary' : 'default'"
            :icon="mode.icon"
            size="xs"
            @click.stop="activeFormatMode = mode.label"
          >
            {{ toLabel(mode.label) }}
          </XButton>
        </div>
        <div class="flex items-center gap-2">
          <XButton
            v-for="(mode, i) in deviceModes"
            :key="i"
            rounding="full"
            respond="icon:xl"
            design="outline"
            :theme="activeDeviceMode === mode.label ? 'rose' : 'default'"
            :icon="mode.icon"
            size="xs"
            @click.stop="activeDeviceMode = mode.label"
          >
            {{ toLabel(mode.label) }}
          </XButton>
        </div>
      </div>
      <div class="min-h-0 h-full relative mx-auto flex flex-col" :class="deviceModeConfig?.wrapClass">
        <ElBrowserFrameDevice
          ref="frameRef"
          :device-mode="activeDeviceMode"
          class="rounded-md shadow-lg border border-theme-200"
          :url="getPostPreviewRoute({ post, card, format: activeFormatMode })"
          frame-id="post-preview-iframe"
          :browser-bar="true"
          :email-bar="{
            subject: post.emailConfig.value.subject || 'No subject',
            preview: post.emailConfig.value.preview || 'No preview',
            senderEmail: post.sender.value.senderEmail || '',
            senderName: post.sender.value.senderName || 'No sender',
            avatar: post.sender.value.avatar,
            dateAt: post.publishAt.value,
          }"
          :format-mode="activeFormatMode"
          :display-url="`/posts/${post.slug.value}`"
        />
      </div>
    </div>
  </div>
</template>
