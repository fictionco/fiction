<script lang="ts" setup>
import type {
  FactorRouter,
  MemberAccess,
} from '@factor/api'
import {
  localRef,
  onResetUi,
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
import ElOnboard from '../plugin-onboard/el/OnboardWidget.vue'

defineProps({
  requires: {
    type: Array as vue.PropType<('plan' | 'instance')[]>,
    default: undefined,
  },
  access: {
    type: String as vue.PropType<MemberAccess>,
    default: 'view',
  },
})

const {
  factorUser,
  fictionOnboard,
} = useService<{
  factorAdmin: FactorAdmin
  fictionPayment: FictionPayment
  factorUser: FactorUser
  factorRouter: FactorRouter
  fictionInstance: FictionInstance
  fictionOnboard: FictionOnboard
}>()

const showOnboard = localRef({
  key: 'FictionOnboardVis',
  def: false,
  lifecycle: 'local',
})

const menuVis = vue.ref(false)
onResetUi(() => (menuVis.value = false))

// const showRequires = vue.computed(() => {
//   if (!props.requires)
//     return

//   if (props.requires.includes('instance')) {
//     const instanceState = fictionInstance.instanceState.value
//     const status = instanceState.status || ''
//     const started = ['running', 'starting'].includes(status)
//     if (!started)
//       return 'instance'
//   }
// })
</script>

<template>
  <ElPanel
    v-if="factorUser.activeOrganizationId.value === 'example'"
    class="w-full"
    box-class="px-4 py-3 text-sm font-semibold"
    panel-class="border-caution-300 border bg-caution-50 text-caution-700 shadow-sm sm:rounded-lg mb-4"
  >
    You are currently viewing the shared example organization.
    <a
      v-if="factorUser.activeUser.value?.userId === 'anonymous'"
      href="/register"
      class="text-caution-500 hover:text-caution-800"
    >Create Account &rarr;</a>
  </ElPanel>
  <ElPanel
    v-if="!factorUser.activeOrganization.value?.onboard?.completed"
    class="w-full"
    box-class="px-4 py-3 text-sm font-semibold "
    panel-class="border-theme-300 border bg-theme-0 text-theme-700 shadow-sm sm:rounded-lg mb-4"
  >
    <div class="flex items-center justify-between">
      <div>
        <span> Fiction Getting Started</span>
        <span class="text-theme-400 ml-4 text-xs tracking-tight">
          {{
            `${fictionOnboard.stats.value.completed} of ${fictionOnboard.stats.value.total} steps completed`
          }}
        </span>
      </div>
      <div>
        <ElButton
          size="xs"
          btn="naked"
          class="bg-theme-200 hover:bg-theme-100 text-theme-600"
          @click="showOnboard = !showOnboard"
        >
          {{ !showOnboard ? "Show Onboarding" : "Hide" }}
        </ElButton>
      </div>
    </div>

    <ElOnboard v-if="showOnboard" />
  </ElPanel>
</template>
