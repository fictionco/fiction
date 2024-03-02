<script lang="ts" setup>
import ElButton from '@fiction/ui/ElButton.vue'
import { useService } from '../inject'
import type { FictionRouter } from '../plugin-router'

const { fictionRouter } = useService<{ fictionRouter: FictionRouter }>()
</script>

<template>
  <ElButton btn="primary" :to="fictionRouter.link('accountNewOrg').value">
    New Organization
  </ElButton>
  <ElButton btn="primary" :to="fictionRouter.link('newProject').value">
    New Project
  </ElButton>
</template>
