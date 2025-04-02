<script lang="ts" setup>
import { vue } from '@fiction/core/index.js'
import XButton from '../buttons/XButton.vue'
import ElTooltip from '../common/ElTooltip.vue'
import { FrameNavigator } from './elBrowserFrameUtil.js'

const { url = '/', displayUrl = '/' } = defineProps<{
  url?: string
  displayUrl?: string
}>()

const emit = defineEmits<{
  (event: 'update:url', payload: string): void
}>()

const navigator = new FrameNavigator({
  updateCallback: async path => emit('update:url', path),
  urlOrPath: vue.computed(() => url || '/'),
  displayUrl: vue.computed(() => displayUrl || ''),
})
</script>

<template>
  <div class="flex items-center justify-between px-2 py-2 border-b border-theme-200 dark:border-theme-600">
    <div class="w-full items-center justify-center lg:flex lg:space-x-2">
      <div class="space-x-1 hidden lg:flex" :data-nav-index="navigator.currentIndex">
        <button
          class="dark:bg-theme-600/60  size-6 text-base  items-center justify-center rounded-md flex"
          :class="!navigator.canGoBack() ? 'cursor-not-allowed opacity-20' : 'cursor-pointer hover:opacity-70'"
          :disabled="!navigator.canGoBack()"
          @click="navigator.navigateFrame('backward')"
        >
          <div class="i-tabler-arrow-left" />
        </button>
        <button
          class="dark:bg-theme-600/60  size-6 text-base  items-center justify-center rounded-md flex"
          :class="!navigator.canGoForward() ? 'cursor-not-allowed opacity-20' : 'cursor-pointer hover:opacity-70'"
          :disabled="!navigator.canGoForward()"
          @click="navigator.navigateFrame('forward')"
        >
          <div class="i-tabler-arrow-right" />
        </button>
      </div>
      <label for="urlBar" class="relative flex grow rounded-md shadow-sm gap-0.5 group border border-theme-200 dark:bg-theme-700 dark:border-theme-600 focus-within:border-theme-200 overflow-hidden">
        <ElTooltip
          :timeout="0"
          :max-width="350"
          direction="bottom"
          :content="`Base URL: ${navigator.displayUrlObject.value.origin}`"
          class="group/url bg-theme-0 dark:bg-theme-600/40   text-theme-300 dark:text-theme-400  inline-flex select-none items-center rounded-l-md pl-2 pr-2 font-medium text-xs"
        >
          <span class="i-tabler-link text-lg" />
        </ElTooltip>
        <input
          id="urlBar"
          v-model="navigator.typedPath.value"
          type="text"
          class="block focus:border-0 text-theme-500 dark:text-theme-0 dark:bg-theme-700 border-0 w-full min-w-0 flex-1 rounded-none rounded-r-md text-xs font-mono focus:outline-none focus:ring-0 p-1.5"
          @keyup.enter="navigator.setNewPath({ fullPath: navigator.typedPath.value })"
        >
      </label>
    </div>
    <div class="ml-4 hidden shrink-0 md:block">
      <XButton
        :data-set-path="navigator.setPath.value"
        :data-typed-path="navigator.typedPath.value"
        :theme="navigator.typedPath.value !== navigator.setPath.value ? 'emerald' : 'default'"
        size="sm"
        rounding="full"
        @click="navigator.setNewPath({ fullPath: navigator.typedPath.value })"
      >
        Go &rarr;
      </XButton>
    </div>
    <slot name="browserBar" />
  </div>
</template>
