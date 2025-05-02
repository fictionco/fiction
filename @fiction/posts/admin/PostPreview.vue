<script lang="ts" setup>
import type { NavListItem } from '@fiction/core'
import type { Card } from '@fiction/site'
import type { FrameUtility } from '@fiction/ui/frame/elBrowserFrameUtil.js'
import type { Post } from '../post.js'
import { toLabel, vue, useService } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import ElBrowserFrameDevice from '@fiction/ui/frame/ElBrowserFrameDevice.vue'
import { getPostPreviewRoute } from '../utils/links.js'
import PostEmailSendTest from './PostEmailSendTest.vue'

defineOptions({ name: 'PostPreview' })

const { post, card } = defineProps<{
  post?: Post
  card: Card
}>()

const service = useService()

const frameRef = vue.ref<HTMLElement & { frameUtility: FrameUtility }>() // Reference to the child component

type FormatMode = 'browser' | 'email' | 'test'
const formatModes: (NavListItem & { wrapClass: string, key: FormatMode })[] = [
  { key: 'browser', icon: { class: 'i-tabler-browser' }, wrapClass: 'w-full' },
  { key: 'email', icon: { class: 'i-tabler-mail' }, wrapClass: 'w-[60%] max-w-sm' },
  { key: 'test', label: 'Send Test Email', icon: { class: 'i-tabler-mail' }, wrapClass: 'w-[90%] max-w-2xl' },
] as const

const deviceModes = [
  { key: 'desktop', icon: 'i-tabler-device-desktop', wrapClass: 'w-full' },
  { key: 'mobile', icon: 'i-tabler-device-mobile', wrapClass: 'w-[60%] max-w-sm' },
  { key: 'tablet', icon: 'i-tabler-device-ipad', wrapClass: 'w-[85%] max-w-xl' },
  { key: 'landscape', icon: 'i-tabler-device-ipad-horizontal', wrapClass: 'w-[90%] max-w-2xl' },
] as const

type DeviceMode = typeof deviceModes[number]['key']
const activeDeviceMode = vue.ref<DeviceMode>('desktop')
const deviceModeConfig = vue.computed(() => deviceModes.find(mode => mode.key === activeDeviceMode.value))
const activeFormatMode = vue.ref<FormatMode>('browser')

const org = vue.computed(() => service.fictionUser.activeOrganization?.value)
</script>

<template>
  <div v-if="post" class="h-full max-w-screen-xl mx-auto">
    <div class="flex flex-col gap-8 h-full">
      <div class="flex justify-between items-center gap-4">
        <div class="flex items-center gap-2">
          <XButton
            v-for="(mode, i) in formatModes"
            :key="i"
            rounding="full"
            respond="icon:xl"
            design="outline"
            :theme="activeFormatMode === mode.key ? 'primary' : 'default'"
            :icon="mode.icon"
            size="xs"
            @click.stop="activeFormatMode = mode.key"
          >
            {{ mode.label || toLabel(mode.key) }}
          </XButton>
        </div>
        <div class="flex items-center gap-2">
          <XButton
            v-for="(mode, i) in deviceModes"
            :key="i"
            rounding="full"
            respond="icon:xl"
            design="outline"
            :theme="activeDeviceMode === mode.key ? 'rose' : 'default'"
            :icon="mode.icon"
            size="xs"
            @click.stop="activeDeviceMode = mode.key"
          >
            {{ toLabel(mode.key) }}
          </XButton>
        </div>
      </div>
      <div class="min-h-0 h-full relative mx-auto flex flex-col" :class="deviceModeConfig?.wrapClass">
        <PostEmailSendTest v-if="activeFormatMode === 'test'" :post :card class="max-w-screen-sm mx-auto" />
        <ElBrowserFrameDevice
          v-else
          ref="frameRef"
          :device-mode="activeDeviceMode"
          class="rounded-md shadow-lg border border-theme-200"
          :url="getPostPreviewRoute({ post, card, format: activeFormatMode })"
          frame-id="post-preview-iframe"
          :browser-bar="true"
          :email-bar="{
            subject: post.subject.value || 'No subject',
            preview: post.preview.value || 'No preview',
            senderEmail: org?.orgEmail || '',
            senderName: org?.orgName || 'No sender',
            avatar: org?.avatar,
            dateAt: post.publishAt.value,
          }"
          :format-mode="activeFormatMode"
          :display-url="`/posts/${post.slug.value}`"
        />
      </div>
    </div>
  </div>
</template>
