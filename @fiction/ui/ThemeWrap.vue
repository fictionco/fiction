<script lang="ts" setup>
import type { ColorTheme } from '@fiction/core'
import { getColorScheme, isDarkOrLightMode, vue } from '@fiction/core'

const props = defineProps({
  theme: { type: String as vue.PropType<ColorTheme>, default: 'gray' },
  primary: { type: String as vue.PropType<ColorTheme>, default: 'blue' },
  mode: { type: String as vue.PropType<'light' | 'dark'>, default: 'light' },
})

const theme = vue.computed(() => getColorScheme(props.theme || 'gray'))
const primary = vue.computed(() => getColorScheme(props.primary || 'blue'))

const themeWrapEl = vue.ref<HTMLElement>()
const modeClass = vue.ref<string>(props.mode)
const loading = vue.ref(true)
vue.onMounted(() => {
  if (themeWrapEl.value && !modeClass.value) {
    const md = isDarkOrLightMode(themeWrapEl.value)

    modeClass.value = md
  }
  loading.value = false
})
</script>

<template>
  <div v-show="!loading" ref="themeWrapEl" class="transition-opacity x-theme-wrap" :class="[modeClass]">
    <div class="x-theme-base bg-theme-0 dark:bg-theme-900 text-theme-900 dark:text-theme-0">
      <slot />
    </div>
  </div>
</template>

<style lang="less">
.x-theme-wrap{
  .x-theme-base {
    min-height: 100dvh;
  }

  // --font-family-mono: v-bind(fonts?.mono);
  // --font-family-input: v-bind(fonts?.input);
  // --font-family-sans: v-bind(fonts?.sans);
  // --font-family-serif: v-bind(fonts?.serif);
  // --font-family-title: v-bind(fonts?.title);
  // --font-family-body: v-bind(fonts?.body);
  .x-font-title {
    font-family: var(--font-family-title);
  }
  .x-font-body {
    font-family: var(--font-family-body);
  }
  .x-font-input {
    font-family: var(--font-family-input);
  }
  .x-font-mono {
    font-family: var(--font-family-mono);
  }
  .x-font-sans {
    font-family: var(--font-family-sans);
  }

  --theme-0: v-bind("theme[0]");
  --theme-25: v-bind("theme[25]");
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
  --theme-950: v-bind("theme[950]");
  --theme-975: v-bind("theme[975]");
  --theme-1000: v-bind("theme[1000]");
  --primary-0: v-bind("primary?.[0]");
  --primary-25: v-bind("primary?.[25]");
  --primary-50: v-bind("primary?.[50]");
  --primary-100: v-bind("primary?.[100]");
  --primary-200: v-bind("primary?.[200]");
  --primary-300: v-bind("primary?.[300]");
  --primary-400: v-bind("primary?.[400]");
  --primary-500: v-bind("primary?.[500]");
  --primary-600: v-bind("primary?.[600]");
  --primary-700: v-bind("primary?.[700]");
  --primary-800: v-bind("primary?.[800]");
  --primary-900: v-bind("primary?.[900]");
  --primary-950: v-bind("primary?.[950]");
  --primary-975: v-bind("primary?.[975]");
  --primary-1000: v-bind("primary?.[1000]");

}

/* Chrome, Safari and Opera */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
