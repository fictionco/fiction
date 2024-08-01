<script lang="ts" setup>
import { getColorScheme, vue, windowSize } from '@fiction/core'
import chroma from 'chroma-js'
import ElRichImage from '@fiction/ui/media/ElImage.vue'
import ElOverlay from '@fiction/ui/ElOverlay.vue'
import type { Form } from '../../form'
import FormProgressBar from './FormProgressBar.vue'
import type { EntryProps } from './theme'
import FormLoading from './FormLoading.vue'

const props = defineProps({
  form: {
    type: Object as vue.PropType<Form>,
    required: true,
  },
  themeStyle: {
    type: Object as vue.PropType<EntryProps>,
    required: true,
  },
})
const cardEl = vue.computed(() => props.form.activeCard.value?.el.value)
const theme = vue.computed(() => {
  return getColorScheme(props.themeStyle.elementScheme || 'slate').colors
})

const loading = vue.ref(true)

/**
 * Import google fonts
 */
vue.watch(
  () => props.themeStyle.themeFont,
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
  const s = props.themeStyle

  const out = {
    color: s.bgColor,
    mode: s.bgMode,
    image: s.bgImage?.[0],
    gradient: s.bgGradient,
  }

  return out
})

const action = vue.computed(() => {
  const actionColor = props.themeStyle.actionColor
  const main = actionColor || theme.value['400']

  const contrast
    = chroma.contrast(main, '#ffffff') < 2
      ? chroma.mix('#000000', main, 0.2)
      : chroma.mix('#FFFFFF', main, 0.2)

  if (!actionColor) {
    const t = theme.value
    return {
      main,
      contrast,
      light: t['300'],
      dark: t['500'],
    }
  }
  else {
    return {
      main,
      contrast,
      light: chroma(main).brighten(0.5).hex(),
      dark: chroma(main).darken(0.5).hex(),
    }
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
vue.onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 500)
})
</script>

<template>
  <div
    class="card-deck-theme theme-wrap theme-font overflow-hidden bg-cover"
    :data-dev="form.isDev ? 'true' : 'false'"
    :style="{
      backgroundColor: bg.mode === 'color' ? bg.color : `#ffffff`,
    }"
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
    <FormProgressBar :progress="form.percentComplete.value" />
    <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 translate-y-10"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-300"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-10"
      mode="out-in"
    >
      <FormLoading
        v-if="loading"
        key="loading"
        :is-dev="form.isDev"
      />
      <div
        v-else-if="!cardEl"
        key="2"
        class="text-theme-300 absolute inset-0 flex h-full w-full items-center justify-center text-sm uppercase"
      >
        Nothing found
      </div>
      <div
        v-else
        key="another"
        class="relative z-20"
      >
        <transition :name="form?.slideTransition.value" mode="out-in">
          <component
            :is="cardEl.component"
            :key="form.activeCard.value?.cardId"
            :form="form"
            v-bind="cardEl.props"
            :card="form.activeCard.value"
          />
        </transition>
      </div>
    </transition>
  </div>
</template>

<style lang="less">
.card-deck-theme {
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

  --action-main: v-bind("action.main");
  --action-contrast: v-bind("action.contrast");
  --action-light: v-bind("action.light");
  --action-dark: v-bind("action.dark");

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

  --theme-font: v-bind("props.themeStyle.themeFont?.font");

  .theme-font {
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
