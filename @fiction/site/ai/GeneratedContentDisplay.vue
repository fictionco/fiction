<script setup lang="ts">
import { type MediaObject, vue } from '@fiction/core'
import XMedia from '@fiction/ui/media/XMedia.vue'

const props = defineProps<{
  field: unknown
}>()

const isObject = vue.computed(() => typeof props.field === 'object' && props.field !== null)
const isArray = vue.computed(() => Array.isArray(props.field))
const isImage = vue.computed(() => isObject.value && 'url' in (props.field as Record<string, any>) && typeof (props.field as Record<string, any>).url === 'string')
const isCode = vue.computed(() => typeof props.field === 'string' && props.field.trim().startsWith('{') && props.field.trim().endsWith('}'))

const formattedCode = vue.computed(() => {
  if (isCode.value) {
    try {
      return JSON.stringify(JSON.parse(props.field as string), null, 2)
    }
    catch {
      return props.field as string
    }
  }
  return ''
})

const codeLines = vue.computed(() => {
  if (isCode.value) {
    return formattedCode.value.split('\n')
  }
  return []
})
</script>

<template>
  <div class="generated-content-display text-sm">
    <div v-if="isImage" class="image-container">
      <XMedia class="h-40 aspect-video" :media="(field as MediaObject)" />
    </div>
    <div v-else-if="isArray" class="array-container bg-theme-50 dark:bg-theme-700 rounded-md space-y-6">
      <div v-for="(item, index) in field" :key="index">
        <GeneratedContentDisplay :field="item" />
      </div>
    </div>
    <div v-else-if="isObject" class="object-container bg-theme-50 dark:bg-theme-700 rounded-md space-y-6">
      <div v-for="(value, key) in field" :key="key" class="mb-2 space-y-1">
        <div class="text-xs text-theme-500">
          {{ key }}:
        </div>
        <GeneratedContentDisplay :field="value" />
      </div>
    </div>
    <div v-else-if="isCode" class="code-container bg-theme-100 dark:bg-theme-800 rounded-md overflow-x-auto font-mono text-xs">
      <pre class="whitespace-pre"><code><span v-for="(line, index) in codeLines" :key="index" class="block">{{ line }}</span></code></pre>
    </div>
    <div v-else class="text-container">
      {{ field }}
    </div>
  </div>
</template>
