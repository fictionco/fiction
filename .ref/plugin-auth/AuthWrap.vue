<script lang="ts" setup>
import ElSpinner from '@factor/ui/ElSpinner.vue'
import EffectGrid from '@factor/ui/EffectGrid.vue'
import { useService } from '../inject'
import type { FactorApp } from '../plugin-app'
import { getColorScheme, vue } from '../utils'

defineProps({
  title: { type: String, default: '' },
  subTitle: { type: String, default: '' },
  loading: { type: Boolean, default: false },
})
const { factorApp } = useService<{ factorApp: FactorApp }>()
const theme = vue.computed(() => {
  return getColorScheme('slate').colors
})
</script>

<template>
  <div class="auth-wrap relative flex overflow-hidden bg-white">
    <div
      class="relative hidden w-[50%] overflow-hidden bg-gradient-to-br from-black via-black to-slate-900 text-white xl:block"
    >
      <div class="relative z-20 p-6" />
      <EffectGrid />
    </div>
    <div class="relative flex min-h-screen grow flex-col items-center">
      <div class="relative">
        <div
          class="relative mx-auto flex items-center justify-between px-4 py-2 text-xs md:max-w-7xl"
        >
          <div class="mt-2 text-center xl:hidden" />
          <div
            id="google-signin-prompt"
            class="absolute right-0 top-full"
          />
        </div>
      </div>
      <div
        class="relative z-20 mx-auto flex w-full grow flex-col justify-center"
      >
        <div class="auth-form pb-24 transition-all">
          <div
            class="bg-theme-0 text-theme-900 mx-auto w-full max-w-xs rounded-lg"
          >
            <div class="relative px-4 py-24">
              <div :class="loading ? 'opacity-20' : ''">
                <div class="font-brand mb-12 text-left md:text-center">
                  <h1 class="text-2xl font-bold tracking-tight">
                    {{ title }}
                  </h1>
                  <h4
                    v-if="subTitle || $slots.sub"
                    class="text-theme-400 mt-4 text-lg font-medium"
                  >
                    <template v-if="$slots.sub">
                      <slot name="sub" />
                    </template>
                    <template v-else>
                      {{ subTitle }}
                    </template>
                  </h4>
                </div>
                <div class="pb-24 md:pb-8">
                  <slot />
                  <div
                    v-if="$slots.footer"
                    class="form-footer mt-6 text-center text-sm font-medium"
                  >
                    <slot name="footer" />
                  </div>
                </div>
              </div>
              <div
                v-if="loading"
                class="text-theme-300 absolute inset-0 flex h-full w-full flex-col items-center justify-center"
              >
                <ElSpinner class="h-10 w-10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less">
.auth-wrap {
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
