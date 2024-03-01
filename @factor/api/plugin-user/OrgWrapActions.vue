<script lang="ts" setup>
import ElButton from '@factor/ui/ElButton.vue'
import { useService } from '../inject'
import type { FactorRouter } from '../plugin-router'

const { factorRouter } = useService<{ factorRouter: FactorRouter }>()
</script>

<template>
  <ElButton btn="primary" :to="factorRouter.link('accountNewOrg').value">
    New Organization
  </ElButton>
  <ElButton btn="primary" :to="factorRouter.link('newProject').value">
    New Project
  </ElButton>
</template>
