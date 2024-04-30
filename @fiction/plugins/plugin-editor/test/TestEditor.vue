<script lang="ts" setup>
import ThemeWrap from '@fiction/ui/ThemeWrap.vue'
import ProseEditor from '../ProseEditor.vue'
import { content } from './testContent'
</script>

<template>
  <ThemeWrap>
    <div class="dark:bg-theme-900 bg-theme-0 dark:text-theme-0 py-24">
      <ProseEditor :content="content" />
    </div>
  </ThemeWrap>
</template>
