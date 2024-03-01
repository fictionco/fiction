<script lang="ts" setup>
import ElModal from '@factor/ui/ElModal.vue'
import type { FactorRouter } from '@factor/api'
import { useService } from '@factor/api'
import ElServerManager from './ElServerManager.vue'
import type { FictionInstance } from '.'

const { fictionInstance } = useService<{
  factorRouter: FactorRouter
  fictionInstance: FictionInstance
}>()
</script>

<template>
  <ElModal
    v-model:vis="fictionInstance.showServerModal.value"
    modal-class="max-w-xl p-12"
  >
    <ElServerManager />
  </ElModal>
</template>
