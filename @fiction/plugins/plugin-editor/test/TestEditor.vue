<script lang="ts" setup>
import ProseEditor from '../ProseEditor.vue'
import { content } from './testContent'
</script>

<template>
  <div>
    <ProseEditor :content="content" />
  </div>
</template>
