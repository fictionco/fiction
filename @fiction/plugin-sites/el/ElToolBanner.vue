<script lang="ts" setup>
import type { ActionItem, vue } from '@fiction/core'

defineProps({
  title: {
    type: String,
    default: '',
  },
  sub: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: '',
  },
  actions: {
    type: Array as vue.PropType<ActionItem[]>,
    default: () => [],
  },
  mode: {
    type: String as vue.PropType<'mast' | 'hero'>,
    default: 'mast',
  },
})
</script>

<template>
  <div class=" rounded-lg text-sm select-none" :class="mode === 'hero' ? 'flex items-center space-x-4 p-4' : 'text-center p-6'">
    <div class="text-theme-300">
      <div class="text-5xl inline-block   " :class="[icon, mode === 'hero' ? 'mb-0' : 'mb-2']" />
    </div>
    <div>
      <div class="font-bold">
        {{ title }}
      </div>
      <div class="text-xs text-theme-500">
        {{ sub }}
      </div>
      <div
        v-if="actions.length > 0"
        class="flex  mt-4"
        :class="[mode === 'hero' ? ' ' : 'justify-center']"
      >
        <div
          v-for="(item, i) in actions"
          :key="i"
          class=" text-xs space-x-1 flex items-center font-medium tracking-tight transition-all cursor-pointer text-theme-600 bg-theme-0 hover:bg-primary-100 hover:text-primary-500 rounded-md py-1 px-2  border border-theme-300 hover:border-primary-300"
          @click="item.onClick?.({ event: $event, item })"
        >
          <div
            :class="item.icon"
            class="text-lg"
          />
          <div class=" leading-tight">
            {{ item.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
