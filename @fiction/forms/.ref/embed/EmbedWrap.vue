<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import type { ColorTheme } from '@fiction/core'
import { getColorScheme } from '@fiction/core/utils/colors'
import { onEvent } from '@fiction/core/utils/event'
import EmbedSlideOver from './EmbedSlideOver.vue'
import EmbedModal from './EmbedModal.vue'
import EmbedPopover from './EmbedPopover.vue'
import ElCloseButton from './ElCloseButton.vue'
import { buttonIcons, embedPosition } from './util'

const props = defineProps({
  embedUrl: { type: String, required: true },
  embedId: { type: String, required: true },
})

const url = computed(() => {
  return new URL(props.embedUrl)
})

const active = ref(false)

const config = computed(() => {
  const sp = url.value.searchParams

  const position = sp.get('position') || 'bc'
  const p = embedPosition.find(p => p.value === position) || embedPosition[0]

  return {
    mode: sp.get('mode') || 'modal',
    trigger: sp.get('trigger') || 'click',
    text: sp.get('text') || '',
    icon: sp.get('icon') || buttonIcons[0].value,
    scheme: getColorScheme((sp.get('scheme') || 'slate') as ColorTheme),
    style: {
      ...p.style,
      'z-index': 1000,
      'filter': 'drop-shadow(rgba(0, 0, 0, 0.06) 0px 1px 6px) drop-shadow(rgba(0, 0, 0, 0.16) 0px 2px 32px)',
    },
  }
})

onMounted(() => {
  if (config.value.trigger === 'init')
    active.value = true
})

function activateOnClick() {
  active.value = true
}

function close() {
  active.value = false
}

onEvent('triggerEmbed', () => {
  active.value = true
})
</script>

<template>
  <div class="fiction-embedded" :data-fiction-url="embedUrl">
    <template v-if="!active">
      <div
        v-if="config.trigger === 'bubble'"
        class="bg-theme-700 text-theme-50 hover:bg-theme-600 fixed flex h-12 w-12 cursor-pointer items-center justify-center rounded-full p-2"
        :style="config.style"
        @click="activateOnClick()"
      >
        <div class="icon">
          <div class="text-2xl" :class="config.icon" />
        </div>
      </div>
      <div
        v-else-if="config.trigger === 'button'"
        class="bg-theme-700 text-theme-100 hover:bg-theme-600 fixed flex cursor-pointer items-center justify-center space-x-2 rounded-lg px-3 py-2"
        :style="config.style"
        @click="activateOnClick()"
      >
        <div class="icon text-theme-200">
          <div class="text-2xl" :class="config.icon" />
        </div>
        <div v-if="config.text" class="text text-sm capitalize">
          {{ config.text }}
        </div>
      </div>
    </template>

    <div>
      <EmbedSlideOver v-if="config.mode === 'slideover'" v-model:vis="active">
        <iframe :src="url.toString()" class="h-full w-full" />
      </EmbedSlideOver>
      <EmbedModal v-else-if="config.mode === 'modal'" v-model:vis="active">
        <iframe :src="url.toString()" class="h-full w-full" />
      </EmbedModal>
      <EmbedPopover v-else-if="config.mode === 'popover'" v-model:vis="active">
        <iframe :src="url.toString()" class="h-full w-full" />
      </EmbedPopover>
      <div
        v-else-if="config.mode === 'full' && active"
        class="fixed inset-0 z-40"
      >
        <ElCloseButton
          class="absolute right-6 top-6"
          @click.prevent="close()"
        />
        <iframe :src="url.toString()" class="h-full w-full" />
      </div>
      <div
        v-else-if="config.mode === 'inline'"
        class="rounded-lg overflow-hidden"
      >
        <iframe :src="url.toString()" class="aspect-[4/3] w-full" />
      </div>
    </div>
  </div>
</template>

<style lang="less">
.fiction-embedded {
  --theme-0: v-bind("config.scheme[0]");
  --theme-50: v-bind("config.scheme[50]");
  --theme-100: v-bind("config.scheme[100]");
  --theme-200: v-bind("config.scheme[200]");
  --theme-300: v-bind("config.scheme[300]");
  --theme-400: v-bind("config.scheme[400]");
  --theme-500: v-bind("config.scheme[500]");
  --theme-600: v-bind("config.scheme[600]");
  --theme-700: v-bind("config.scheme[700]");
  --theme-800: v-bind("config.scheme[800]");
  --theme-900: v-bind("config.scheme[900]");
  --theme-1000: v-bind("config.scheme[1000]");
}
</style>
