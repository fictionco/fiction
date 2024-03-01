<script setup lang="ts">
import { unhead } from '@factor/api'
import ElPanel from '@factor/ui/ElPanel.vue'

unhead.useHead({
  title: 'Dashboard',
  meta: [{ name: `description`, content: `` }],
})
</script>

<template>
  <ElPanel title="Data Ingest" />
</template>

<style lang="less"></style>
