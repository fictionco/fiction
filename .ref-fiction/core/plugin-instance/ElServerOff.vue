<script lang="ts" setup>
import type {
  FactorRouter,
} from '@factor/api'
import {
  emitEvent,
  useService,
  vue,
} from '@factor/api'
import type { FactorUser } from '@factor/api/plugin-user'
import ElButton from '@factor/ui/ElButton.vue'
import ElPanel from '@factor/ui/ElPanel.vue'
import type { FictionPayment } from '../plugin-payment'
import type { FactorAdmin } from '../plugin-admin'
import type { FictionInstance } from '../plugin-instance'
import type { FictionOnboard } from '../plugin-onboard'

const {
  fictionInstance,
} = useService<{
  factorAdmin: FactorAdmin
  fictionPayment: FictionPayment
  factorUser: FactorUser
  factorRouter: FactorRouter
  fictionInstance: FictionInstance
  fictionOnboard: FictionOnboard
}>()

const showEl = vue.computed(() => {
  const instanceState = fictionInstance.instanceState.value
  const status = instanceState.status || ''
  const isOff = !['running', 'starting'].includes(status)
  return isOff
})
</script>

<template>
  <ElPanel
    v-if="showEl"
    box-class="px-4 py-3 text-sm font-semibold"
    panel-class="border-theme-300 border bg-theme-100 text-theme-700 shadow-sm sm:rounded-lg mb-4"
  >
    <div class="flex items-center justify-between">
      <div class="font-bold tracking-tight">
        <span>Active Server Required</span>
      </div>
      <div>
        <ElButton
          size="xs"
          btn="naked"
          class="bg-primary-600 text-primary-50 hover:opacity-70"
          @click.stop.prevent="emitEvent('showServerManager')"
        >
          Start Server
        </ElButton>
      </div>
    </div>
  </ElPanel>
</template>
