<script lang="ts" setup>
import ElButton from '@factor/ui/ElButton.vue'
import type {
  FactorRouter,
} from '@factor/api'
import {
  resetUi,
  standardDate,
  useService,
  vue,
} from '@factor/api'
import type { FactorUser } from '@factor/api/plugin-user'
import ElModalBanner from '@factor/ui/ElModalBanner.vue'
import type { FictionPayment } from '../plugin-payment'
import type { FictionUsage } from '../plugin-usage'
import ElJobProgress from './ElJobProgress.vue'
import type { FictionInstance } from '.'

defineProps({
  title: { type: String, default: '' },
  subTitle: { type: String, default: '' },
  description: { type: String, default: '' },
})

const {
  fictionInstance,
  fictionPayment,
  factorRouter,
  fictionUsage,
  factorUser,
} = useService<{
  factorRouter: FactorRouter
  fictionInstance: FictionInstance
  fictionPayment: FictionPayment
  fictionUsage: FictionUsage
  factorUser: FactorUser
}>()

const sending = vue.ref('')

const loading = vue.computed(() => fictionInstance.stateLoading.value)
async function instanceRequest(_action: 'create' | 'delete' | 'stop' | 'cancel') {
  sending.value = _action
  const loadTime = _action === 'create' ? 12 : 5
  fictionInstance.setStateLoading(loadTime)

  await fictionInstance.instanceRequest(_action)

  resetUi({ scope: 'all', cause: 'instanceRequest' })
  sending.value = ''
}

const statusMap = vue.computed(() => {
  const { usedMinutes, paidMinutes, percentUsed, cycleEndAtIso }
    = fictionUsage.activeUsage.value || {}

  const org = factorUser.activeOrganization.value
  const idleTimeout = org?.config?.serverTimeoutMinutes || 25
  return {
    off: {
      title: 'The server is off',
      subTitle: 'Turn on the AI server to run AI models and training',
      moreInfo: 'Starting takes 2 to 5 minutes.',
    },
    starting: {
      title: 'The server is starting',
      subTitle: 'Stand by. This shouldn\'t take long.',
      moreInfo: 'Usually takes 2 to 3 minutes',
    },
    paused: {
      title: 'The server is paused',
      subTitle: 'Your server exists but needs to be started',
      moreInfo: 'Takes 1 minute',
    },
    stopping: {
      title: 'The server is stopping',
      subTitle: 'Currently stopping your server',
      moreInfo: 'Takes 1 minute',
    },
    removing: {
      title: 'The server is shutting down',
      subTitle: 'Currently resetting your server',
      moreInfo: 'Takes 1 minute',
    },
    running: {
      title: 'The server is running',
      subTitle: `Server is ready for requests. It will automatically pause after ${idleTimeout} minutes inactivity.`,
      moreInfo: '',
    },
    error: {
      title: 'The server had an error',
      subTitle: 'Please contact us to resolve the issue.',
      moreInfo: '',
    },
    free: {
      title: `Select a plan to run AI server`,
      subTitle: 'Try 5 days free, plans start at just $19/month.',
      moreInfo: 'AI Server',
    },
    usage: {
      title: `You've used ${percentUsed}% of your minutes`,
      subTitle: `You can upgrade your plan or wait for the next cycle (${standardDate(
        cycleEndAtIso,
      )})`,
      moreInfo: `${usedMinutes} of ${paidMinutes} Minuted Used`,
    },
  }
})

const state = vue.computed(() => {
  return fictionInstance.instanceState.value
})
const isActive = vue.computed(() => {
  const st = state.value.status
  return st === 'running'
})

const noCompute = vue.computed(() => {
  return !fictionPayment.activeCustomer.value?.totalQuantity
})
const fullUsage = vue.computed(() => {
  const used = fictionUsage.activeUsage.value?.percentUsed || 0
  return used > 100
})
const txt = vue.computed(() => {
  if (fullUsage.value)
    return statusMap.value.usage
  const status = state.value.status || 'off'

  const v = statusMap.value[status]

  if (!v)
    console.error('unknown state', v)

  return v
})
</script>

<template>
  <ElModalBanner
    class="flex h-full flex-col justify-center space-y-3 text-center"
    :title="title || txt.title"
    :sub-title="subTitle || txt.moreInfo"
    :description="description || txt.subTitle"
    :icon="isActive ? 'i-carbon-model-alt' : 'i-carbon-model-reference'"
    :loading="loading"
  >
    <template #sub>
      <ElJobProgress
        class="mx-auto my-8 w-full max-w-xl"
        :progress-ids="['start', 'stop', 'delete']"
        ui="naked"
      />
      <div>
        <div class="mx-auto mt-6 max-w-xs space-y-4">
          <ElButton
            v-if="noCompute"
            btn="primary"
            format="block"
            :href="factorRouter.link('plans').value"
          >
            <div>Pick a Plan</div>
            <div class="i-heroicons-arrow-right-circle ml-2 text-xl" />
          </ElButton>

          <ElButton
            v-else-if="fullUsage"
            btn="primary"
            format="block"
            :href="factorRouter.link('manageBilling').value"
          >
            <div>Upgrade Your Plan</div>
            <div class="i-heroicons-arrow-up-circle ml-2 text-xl" />
          </ElButton>

          <ElButton
            v-else-if="
              !state.status || state.status === 'paused' || state.status === 'off'
            "
            btn="primary"
            :loading="sending === 'create'"
            format="block"
            @click="instanceRequest(`create`)"
          >
            Start Server &uarr;
          </ElButton>
          <ElButton
            v-if="state.status === 'running' && fictionInstance.activeJob.value"
            btn="default"
            :loading="sending === 'cancel'"
            format="block"
            @click="instanceRequest(`cancel`)"
          >
            Cancel Active Job &darr;
          </ElButton>
          <ElButton
            v-if="state.status === 'running'"
            btn="default"
            :loading="sending === 'stop'"
            format="block"
            @click="instanceRequest(`stop`)"
          >
            Turn Off Server &darr;
          </ElButton>

          <ElButton
            v-else-if="state.status === 'paused'"
            btn="default"
            :loading="sending === 'delete'"
            format="block"
            @click="instanceRequest(`delete`)"
          >
            Reset Server &darr;&darr;
          </ElButton>
        </div>
      </div>
    </template>
  </ElModalBanner>
</template>
