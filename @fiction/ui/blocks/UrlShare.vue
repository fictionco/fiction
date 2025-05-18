<script lang="ts" setup>
import type { NavListItem, StandardSize } from '@fiction/core'
import { vue } from '@fiction/core'
import XButton from '../buttons/XButton.vue'
import XDropDown from '../common/XDropDown.vue'
import InputText from '../inputs/InputText.vue'

const { url, title, uiSize = 'lg', classes = {} } = defineProps<{
  url: string
  title?: string
  uiSize?: StandardSize
  classes?: {
    inputClass?: string
  }
}>()

const copied = vue.ref(false)
const inputRef = vue.ref<HTMLInputElement | null>(null)

function copyToClipboard() {
  navigator.clipboard.writeText(url)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}

function selectAllText(event: FocusEvent) {
  const input = event.target as HTMLInputElement
  input.select()
}

const socialLinks = vue.computed<NavListItem[]>(() => [
  {
    key: 'twitter',
    label: 'Share on X',
    icon: { class: 'i-tabler-brand-x' },
    onClick: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title || '')}&url=${encodeURIComponent(url)}`),
  },
  {
    key: 'linkedin',
    label: 'Share on LinkedIn',
    icon: { class: 'i-tabler-brand-linkedin' },
    onClick: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`),
  },
  {
    key: 'facebook',
    label: 'Share on Facebook',
    icon: { class: 'i-tabler-brand-facebook' },
    onClick: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`),
  },
  {
    key: 'email',
    label: 'Share via Email',
    icon: { class: 'i-tabler-mail' },
    href: `mailto:?subject=${encodeURIComponent(title || '')}&body=${encodeURIComponent(url)}`,
  },
  {
    key: 'visit',
    label: 'Visit Link',
    icon: { class: 'i-tabler-external-link' },
    href: url,
    target: '_blank',
  },
])
</script>

<template>
  <div class="flex items-center gap-2">
    <InputText
      ref="inputRef"
      :model-value="url"
      class="flex-1"
      readonly
      :ui-size="uiSize"
      :input-class="classes?.inputClass"
      @click="selectAllText"
      @focus="selectAllText"
    />

    <div class="flex items-center gap-2">
      <XButton
        class="shrink-0"
        design="solid"
        rounding="md"
        :size="uiSize"
        :icon="copied ? 'i-tabler-check' : 'i-tabler-copy'"
        :theme="copied ? 'green' : 'primary'"
        @click="copyToClipboard"
      >
        {{ copied ? 'Copied' : '' }}
      </XButton>

      <XDropDown
        mode="hover"
        :items="socialLinks"
        dropdown-alignment="end"
      >
        <XButton
          rounding="md"
          :size="uiSize"
          design="solid"
          theme="default"
          icon-after="i-tabler-chevron-down"
        />
      </XDropDown>
    </div>
  </div>
</template>
