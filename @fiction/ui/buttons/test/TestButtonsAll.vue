<script lang="ts" setup>
import { ButtonDesignSchema, type ButtonHover, ButtonRoundingSchema, SizeSchema, colorThemeUser, vue } from '@fiction/core'
import XButton from '../XButton.vue'

import InputSelect from '../../inputs/InputSelect.vue'

const designs = ButtonDesignSchema.options
const roundings = ButtonRoundingSchema.options
const sizes = SizeSchema.options

function toggleDarkMode() {
  document.documentElement.classList.toggle('light')
}

const loading = vue.ref(false)
const hover = vue.ref<ButtonHover | undefined>('basic')

const overlayBg = vue.computed(() => {
  return {
    background: `url(https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?q=80&w=3223&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D) repeat`,
  }
})
</script>

<template>
  <div id="test-buttons" class="wrap min-h-[100dvh] relative pb-36">
    <div class="mb-4 sticky top-0 p-4 bg-theme-0 dark:bg-theme-900 z-10 border-b border-theme-200 dark:border-theme-700">
      <div class="max-w-screen-2xl mx-auto flex gap-4">
        <XButton @click="toggleDarkMode">
          Toggle Dark Mode
        </XButton>

        <XButton @click="loading = !loading">
          Toggle Loading
        </XButton>

        <InputSelect v-model="hover" :list="['none', 'basic', 'rise', 'fade', 'pop', 'slide']" placeholder="Hover Mode" />
      </div>
    </div>

    <div class=" max-w-screen-2xl mx-auto relative space-y-12">
      <div v-for="theme in colorThemeUser" :key="theme" class="p-4" :style="theme === 'overlay' ? overlayBg : {}">
        <h2 class="text-4xl text-center font-medium mt-24 mb-4 x-font-title">
          Theme: {{ theme }}
        </h2>
        <div class="space-y-8">
          <div v-for="design in designs" :key="design" class="border border-theme-200/70 dark:border-theme-600/70 rounded-md p-4">
            <h3 class="text-xl font-semibold x-font-title mb-4">
              Design: {{ design }}
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div v-for="rounding in roundings" :key="rounding" class="space-y-4">
                <h4 class="font-medium x-font-title">
                  Rounding: {{ rounding }}
                </h4>
                <div v-for="size in sizes" :key="size" class="flex items-center space-x-2">
                  <span class="w-16 text-sm font-sans">{{ size }}:</span>
                  <XButton
                    :theme
                    :design
                    :rounding
                    :size
                    icon="i-tabler-plus"
                    :loading
                    :hover
                  >
                    Button
                  </XButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
