<script lang="ts" setup>
import { vue } from '@fiction/core'
import ThemeWrap from '@fiction/ui/ThemeWrap.vue'
import ProseEditor from '../ProseEditor.vue'
import { content } from './testContent'

const val = vue.ref(content)
const displayMode = vue.ref<'editor' | 'html'>('editor')
</script>

<template>
  <ThemeWrap mode="dark">
    <div class="py-12 prose dark:prose-invert prose-sm lg:prose-lg xl:prose-2xl mx-auto focus:outline-none antialiased space-y-2">
      <div class="flex gap-6 p-4">
        <button @click="displayMode = 'editor'">
          Editor
        </button>
        <button @click="displayMode = 'html'">
          HTML
        </button>
      </div>
      <div v-if="displayMode === 'editor'" class="dark:bg-theme-900 bg-theme-0 dark:text-theme-0 py-24">
        <ProseEditor v-model="val" />
      </div>
      <div v-else-if="displayMode === 'html'" class="dark:bg-theme-900 bg-theme-0 dark:text-theme-0 py-24">
        {{ val }}
      </div>
    </div>
  </ThemeWrap>
</template>
