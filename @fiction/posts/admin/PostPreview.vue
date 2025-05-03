<script lang="ts" setup>
import type { NavListItem } from '@fiction/core'
import type { Card } from '@fiction/site'
import type { FrameUtility } from '@fiction/ui/frame/elBrowserFrameUtil.js'
import type { Post } from '../post.js'
import { toLabel, useService, vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import XDropDown from '@fiction/ui/common/XDropDown.vue'
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
const formatModes: (NavListItem & { wrapClass: string, value: FormatMode })[] = [
  { value: 'browser', icon: { class: 'i-tabler-browser' }, wrapClass: 'w-full' },
  { value: 'email', icon: { class: 'i-tabler-mail' }, wrapClass: 'w-[60%] max-w-sm' },
  { value: 'test', label: 'Send Test Email', icon: { class: 'i-tabler-mail' }, wrapClass: 'w-[90%] max-w-2xl' },
] as const

const activeFormatModeKey = vue.ref<FormatMode>('browser')
const activeFormatMode = vue.computed(() => formatModes.find(mode => mode.value === activeFormatModeKey.value))

type DeviceModeKeys = 'desktop' | 'mobile' | 'tablet' | 'landscape'
const deviceModes: (NavListItem & { wrapClass: string, value: DeviceModeKeys })[] = [
  { value: 'desktop', icon: { class: 'i-tabler-device-desktop' }, wrapClass: 'w-full' },
  { value: 'mobile', icon: { class: 'i-tabler-device-mobile' }, wrapClass: 'w-[60%] max-w-sm' },
  { value: 'tablet', icon: { class: 'i-tabler-device-ipad' }, wrapClass: 'w-[85%] max-w-xl' },
  { value: 'landscape', icon: { class: 'i-tabler-device-ipad-horizontal' }, wrapClass: 'w-[90%] max-w-2xl' },
] as const

type DeviceMode = typeof deviceModes[number]['key']
const activeDeviceModeKey = vue.ref<DeviceMode>('desktop')
const activeDeviceMode = vue.computed(() => deviceModes.find(mode => mode.value === activeDeviceModeKey.value) || deviceModes[0])

const org = vue.computed(() => service.fictionUser.activeOrganization?.value)
</script>

<template>
  <div v-if="post" class="h-full max-w-screen-xl mx-auto">
    <div class="flex flex-col gap-8 h-full">
      <div class="flex justify-between items-center gap-4">
        <div class="flex items-center justify-start gap-2 w-full">
          <XDropDown
            v-model="activeFormatModeKey"
            mode="click"
            :items="formatModes"
          >
            <XButton
              rounding="md"
              :icon="activeFormatMode?.icon"
              size="sm"
              design="ghost"
              icon-after="i-tabler-chevron-down"
            >
              <span class="text-theme-500 font-medium mr-1">Preview Mode:</span> {{ toLabel(activeFormatMode?.value) || 'none' }}
            </XButton>
          </XDropDown>
          <XDropDown
            v-if="activeFormatModeKey !== 'test'"
            v-model="activeDeviceModeKey"
            mode="click"
            :items="deviceModes"
            dropdown-alignment="end"
          >
            <XButton
              rounding="md"
              :icon="activeDeviceMode?.icon"
              size="sm"
              design="ghost"
              icon-after="i-tabler-chevron-down"
            >
              <span class="text-theme-500 font-medium mr-1">Device:</span> {{ toLabel(activeDeviceMode?.value) || 'none' }}
            </XButton>
          </XDropDown>
        </div>
      </div>
      <div v-if="activeFormatModeKey === 'test'" class="w-full">
        <PostEmailSendTest :post :card class="max-w-screen-sm mx-auto" />
      </div>
      <div v-else class="min-h-0 h-full relative mx-auto flex flex-col" :class="activeDeviceMode?.wrapClass">
        <ElBrowserFrameDevice
          ref="frameRef"
          :device-mode="activeDeviceMode?.value"
          class="rounded-md shadow-lg border border-theme-200"
          :url="getPostPreviewRoute({ post, card, format: activeFormatModeKey, org })"
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
          :format-mode="activeFormatModeKey"
          :display-url="`/posts/${post.slug.value}`"
        />
      </div>
    </div>
  </div>
</template>
