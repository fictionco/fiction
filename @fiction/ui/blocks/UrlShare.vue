<script lang="ts" setup>
import type { NavListItem, StandardSize } from '@fiction/core'
import { vue } from '@fiction/core'
import XButton from '../buttons/XButton.vue'
import XDropDown from '../common/XDropDown.vue'
import InputText from '../inputs/InputText.vue'

const props = defineProps<{
  url: string
  title?: string
  uiSize?: StandardSize
  classes?: {
    inputClass?: string
  }
}>()

const copied = vue.ref(false)

function copyToClipboard() {
  navigator.clipboard.writeText(props.url)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}

const socialLinks = vue.computed<NavListItem[]>(() => [
  {
    key: 'twitter',
    label: 'Share on X',
    icon: { class: 'i-tabler-brand-x' },
    onClick: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(props.title || '')}&url=${encodeURIComponent(props.url)}`),
  },
  {
    key: 'linkedin',
    label: 'Share on LinkedIn',
    icon: { class: 'i-tabler-brand-linkedin' },
    onClick: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(props.url)}`),
  },
  {
    key: 'facebook',
    label: 'Share on Facebook',
    icon: { class: 'i-tabler-brand-facebook' },
    onClick: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(props.url)}`),
  },
  {
    key: 'email',
    label: 'Share via Email',
    icon: { class: 'i-tabler-mail' },
    href: `mailto:?subject=${encodeURIComponent(props.title || '')}&body=${encodeURIComponent(props.url)}`,
  },
  {
    key: 'visit',
    label: 'Visit Link',
    icon: { class: 'i-tabler-external-link' },
    href: props.url,
    target: '_blank',
  },
])
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <InputText
      :model-value="url"
      class="flex-1 "
      readonly
      :ui-size="uiSize"
      :input-class="classes?.inputClass"
    />

    <div class="flex items-center gap-4">
      <XButton
        class="shrink-0"
        design="outline"
        rounding="md"
        :size="uiSize"
        :icon="copied ? 'i-tabler-check' : 'i-tabler-copy'"
        :theme="copied ? 'green' : 'primary'"
        @click="copyToClipboard"
      >
        {{ copied ? 'Copied' : 'Copy Link' }}
      </XButton>

      <XDropDown
        mode="hover"
        :items="socialLinks"
        dropdown-alignment="end"
      >
        <XButton
          rounding="md"
          :size="uiSize"
          design="outline"
          theme="default"
          icon="i-tabler-share"
          icon-after="i-tabler-chevron-down"
        >
          Share...
        </XButton>
      </XDropDown>
    </div>
  </div>
</template>
