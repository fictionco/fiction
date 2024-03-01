<script lang="ts" setup>
import { vue } from '@factor/api'
import type { Project } from '@factor/api/plugin-admin'

const props = defineProps({
  project: { type: Object as vue.PropType<Project>, default: undefined },
})

const firstLetters = vue.computed(() => {
  return props.project?.projectName?.slice(0, 2) ?? 'pr'
})
</script>

<template>
  <span
    class="bg-theme-100 inline-flex items-center justify-center rounded-full"
  >
    <span class="text-theme-400 text-xs font-bold uppercase leading-none">{{
      firstLetters
    }}</span>
  </span>
</template>
