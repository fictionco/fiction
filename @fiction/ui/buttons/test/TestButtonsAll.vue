<script lang="ts" setup>
import type { ColorTheme } from '@fiction/core'
import { colorTheme, useService, vue } from '@fiction/core'

const service = useService()
const inputSizes = ['base', 'lg', 'xl', '2xl', '3xl']
const inputSizing = vue.ref<typeof inputSizes[number]>('base')

function selectSize(c: typeof inputSizes[number]) {
  inputSizing.value = c
}

const themeColor = vue.ref<ColorTheme>('slate')
</script>

<template>
  <div id="test-buttons" class="wrap py-12 bg-theme-0 dark:bg-theme-950 text-theme-800 dark:text-theme-0">
    123
  </div>
</template>

<style>

</style>
