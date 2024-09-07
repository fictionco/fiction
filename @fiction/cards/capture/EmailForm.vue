<script lang="ts" setup>
import { useService, vue } from '@fiction/core'
import ElButton from '@fiction/ui/ElButton.vue'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import ElEmail from '@fiction/ui/inputs/InputEmail.vue'
import ElImage from '@fiction/ui/media/ElImage.vue'
import type { FictionSubscribe } from '@fiction/plugin-subscribe'
import type { Card } from '@fiction/site'
import CardText from '../CardText.vue'
import type { UserConfig } from '.'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
  animate: { type: Boolean, default: false },
  showDismiss: { type: Boolean, default: false },
  subscribed: { type: String, default: undefined },
})

const emit = defineEmits<{
  (event: 'update:dismissed', payload: boolean): void
  (event: 'update:subscribed', payload: string): void
}>()

const service = useService<{ fictionSubscribe: FictionSubscribe }>()

const uc = vue.computed(() => {
  return props.card.userConfig.value || {}
})

const orgId = vue.computed(() => props.card.site?.settings.orgId)

const loading = vue.ref(false)
const email = vue.ref('')

async function createSubscription() {
  loading.value = true

  try {
    if (!email.value) {
      throw new Error('Email is required')
    }

    if (!orgId.value) {
      throw new Error('Organization is required')
    }

    const queryVars = { orgId: orgId.value }

    const r = await service.fictionSubscribe.transactions.subscribe.requestSend({ to: email.value, queryVars })

    if (r?.status === 'error') {
      throw new Error(r.message || 'An error occurred')
    }
    else if (r?.status === 'success') {
      const message = 'Success'
      const more = 'Check your email to confirm.'
      service.fictionEnv.events.emit('notify', { type: 'success', message, more })
      emit('update:subscribed', email.value)
    }
  }
  catch (e) {
    service.fictionEnv.events.emit('notify', { type: 'error', message: (e as Error).message })
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <div class="max-w-md mx-auto space-y-8">
      <div class="mx-auto  text-center">
        <div v-if="uc.media" class="mb-3 md:mb-6 text-center">
          <div class="relative inline-block dark:text-theme-0">
            <ElImage :animate="animate ? 'swipe' : false" class="h-10 md:h-20 aspect-[2/1] object-contain" :media="uc.media" />
          </div>
        </div>
        <CardText :animate="animate" path="superHeading" :card="card" class="font-sans text-sm text-theme-400/80 font-medium  text-balance mb-3" />
        <CardText :animate="animate" path="heading" :card="card" class="x-font-title text-xl md:text-2xl font-semibold  text-balance" />
        <CardText :animate="animate" path="subHeading" :card="card" class="text-sm md:text-base text-theme-500 dark:text-theme-300 text-balance my-3" />
      </div>
      <ElForm class="flex gap-2 mx-auto max-w-xs md:max-w-sm" @submit="createSubscription()">
        <ElEmail v-model="email" data-test-id="email" />
        <ElButton data-test-id="submit" btn="primary" class="shrink-0" type="submit" :loading="loading">
          {{ uc.buttonText || 'Subscribe' }}
        </ElButton>
      </ElForm>

      <div v-if="showDismiss" class=" text-xs font-sans antialiased font-medium text-center">
        <a data-test-id="dismiss" href="#" class="text-theme-300 dark:text-theme-400 hover:opacity-80 cursor-pointer select-none" @click.prevent="emit('update:dismissed', true)">{{ uc.dismissText }} &rarr;</a>
      </div>
    </div>
  </div>
</template>
