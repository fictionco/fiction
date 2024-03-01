<script lang="ts" setup>
import type { ColorScheme } from '@factor/api'
import { getColorScheme, vue, windowSize } from '@factor/api'
import chroma from 'chroma-js'
import ElRichImage from '@factor/ui/ElRichImage.vue'
import ElOverlay from '@factor/ui/ElOverlay.vue'
import type { ChatAgent } from '../../obj'
import ElChat from './ElChat.vue'

const props = defineProps({
  agent: {
    type: Object as vue.PropType<ChatAgent>,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})
const opts = vue.computed(() => props.agent.options.value)
const theme = vue.computed(() => {
  let scheme: ColorScheme = 'slate'
  if (opts.value.theme === 'dark')
    scheme = 'slateInverted'

  return getColorScheme(scheme).colors
})

/**
 * Import google fonts
 */
vue.watch(
  () => opts.value.themeFont,
  (v) => {
    if (v && v.link) {
      const el = document.querySelector(`link[href*='${v.link}']`)
      if (!el) {
        const link = document.createElement('link')
        link.href = v.link
        link.rel = 'stylesheet'
        document.head.append(link)
      }
    }
  },
  { immediate: true },
)

const bg = vue.computed(() => {
  const s = opts.value

  const out = {
    color: s.bgColor,
    mode: s.bgMode,
    image: s.bgImage?.[0],
    gradient: s.bgGradient,
  }

  return out
})

const action = vue.computed(() => {
  const colorAction = opts.value.colorAction || '#2563eb'
  const colorActionAlt
    = opts.value.colorActionAlt || theme.value['100'] || '#e2e8f0'

  const contrast
    = chroma(colorAction).luminance() < 0.4
      ? chroma(colorAction).brighten(3.5)
      : chroma(colorAction).darken(3.5)

  const contrastAlt
    = chroma(colorActionAlt).luminance() < 0.4
      ? chroma(colorActionAlt).brighten(3.5)
      : chroma(colorActionAlt).darken(3.5)

  return {
    colorAction,
    contrast,
    colorActionAlt,
    contrastAlt,
  }
})

const inputSize = vue.ref('1rem')
vue.watch(
  () => windowSize.value,
  (v) => {
    if (v.breakpoint.xl)
      inputSize.value = '2rem'

    if (v.breakpoint.md)
      inputSize.value = '1.5rem'
  },
  { immediate: true },
)
</script>

<template>
  <div
    class="chat-theme theme-font bg-theme-0 h-[100vh] w-[100vw] overflow-hidden bg-cover"
  >
    <ElRichImage
      v-if="bg.mode === 'image'"
      class="absolute inset-0"
      :media="bg.image"
    />
    <ElOverlay
      v-else-if="bg.mode === 'gradient'"
      :overlay="{ gradient: bg.gradient, opacity: 100 }"
    />
    <ElChat :agent="agent" :loading="loading" />
  </div>
</template>

<style lang="less">
.chat-theme {
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

  --action-main: v-bind("action.colorAction");
  --action-contrast: v-bind("action.contrast");
  --action-alt: v-bind("action.colorActionAlt");
  --action-alt-contrast: v-bind("action.contrastAlt");

  --input-text: v-bind("theme[900]");
  --input-bg: transparent;
  --input-y: 0.5rem;
  --input-x: 0;
  --input-size: v-bind("inputSize");
  --input-border: transparent;
  --input-border-alt: transparent;
  --input-border-width: 0;
  --input-border-radius: 0;
  --input-placeholder: v-bind("theme[400]");
  --input-max-width: 100%;
  --input-ring-width: 0;
  --input-ring-color: transparent;

  --theme-font: v-bind("opts.themeFont?.font");

  .color .theme-font {
    font-family: var(
      --theme-font,
      "-apple-system, BlinkMacSystemFont, " Segoe UI
        ", Roboto, Helvetica, Arial, sans-serif, " Apple Color Emoji ", " Segoe
        UI Emoji ", " Segoe UI Symbol ""
    );
  }

  /* https://stackoverflow.com/questions/2781549/removing-input-background-colour-for-chrome-autocomplete */
  input:-webkit-autofill {
    transition: all 0s 50000s;
  }
}

.next-enter-from,
.prev-leave-to {
  opacity: 0;
  transform: translateY(50vh);
}
.next-enter-to,
.next-leave-from,
.prev-enter-to,
.prev-leave-from {
  transform: translateY(0);
}
.next-enter-active,
.next-leave-active,
.prev-enter-active,
.prev-leave-active {
  transition: 0.3s ease;
  transition-property: opacity, transform;
}

.next-leave-to,
.prev-enter-from {
  opacity: 0;
  transform: translateY(-50vh);
}
</style>
