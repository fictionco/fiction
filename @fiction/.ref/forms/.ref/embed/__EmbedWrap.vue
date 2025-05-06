<script lang="ts" setup>
import { computed, ref } from 'vue'
import { getColorScheme } from '@factor/api/utils/colors'
import { onEvent } from '@factor/api/utils/event'
import EmbedSlideOver from './EmbedSlideOver.vue'
import EmbedModal from './EmbedModal.vue'
import EmbedPopover from './EmbedPopover.vue'

const props = defineProps({
  embedUrl: { type: String, required: true },
  embedId: { type: String, required: true },
})

const url = computed(() => {
  return new URL(props.embedUrl)
})

const mode = computed(() => {
  return url.value.searchParams.get('mode') || 'inline'
})

const active = ref(false)

onEvent('triggerEmbed', () => {
  active.value = true
})

const theme = computed(() => {
  return getColorScheme('slate').colors
})
</script>

<template>
  <EmbedTrigger
    class="kaption-embedded"
    :class="mode"
    v-bind="props"
  >
    <EmbedSlideOver v-if="mode === 'slideover'" v-model:vis="active">
      <iframe :src="url.toString()" class="h-full w-full" />
    </EmbedSlideOver>
    <EmbedModal v-else-if="mode === 'modal'" v-model:vis="active">
      <iframe :src="url.toString()" class="h-full w-full" />
    </EmbedModal>
    <EmbedPopover v-else-if="mode === 'popover'" v-model:vis="active">
      <iframe :src="url.toString()" class="h-full w-full" />
    </EmbedPopover>
    <div v-else-if="mode === 'full' && active" class="fixed inset-0 z-40">
      <iframe :src="url.toString()" class="h-full w-full" />
    </div>
    <div v-else-if="active && mode === 'inline'">
      <iframe :src="url.toString()" class="aspect-video w-full" />
    </div>
  </EmbedTrigger>
</template>

<style lang="less">
.kaption-embedded {
  --theme-0: v-bind("theme[0]");
  --theme-50: v-bind("theme[50]");
  --theme-100: v-bind("theme[100]");
  --theme-200: v-bind("theme[200]");
  --theme-300: v-bind("theme[300]");
  --theme-400: v-bind("theme[400]");
  --theme-500: v-bind("theme[500]");
  --theme-600: v-bind("theme[600]");
  --theme-700: v-bind("theme[700]");
  --theme-800: v-bind("theme[800]");
  --theme-900: v-bind("theme[900]");
  --theme-1000: v-bind("theme[1000]");
}
</style>
