<script lang="ts" setup>
import ProseEditor from '../ProseEditor.vue'
import { content } from './testContent'
</script>

<template>
  <div class="">
    <div class="dark:bg-theme-900 bg-theme-0 dark:text-theme-0">
      <ProseEditor :content="content" />
    </div>
  </div>
</template>
