<script lang="ts" setup>
import type { TransactionalEmailConfig } from '@fiction/core/plugin-email/index.js'
import type { Card } from '@fiction/site'

import type { FictionSend } from '../index.js'
import type { EmailCampaignConfig } from '../schema.js'
import { useService, vue } from '@fiction/core'
import ElAvatar from '@fiction/ui/common/ElAvatar.vue'
import ElSpinner from '@fiction/ui/loaders/ElSpinner.vue'
import { getEmailForCampaign } from '../utils.js'

const { modelValue } = defineProps<{ modelValue?: EmailCampaignConfig, card: Card }>()

const _emit = defineEmits<{
  (event: 'update:modelValue', payload: EmailCampaignConfig): void
}>()

const { fictionSend, fictionUser } = useService<{ fictionSend: FictionSend }>()

const emailHtml = vue.ref('')
const emailConfig = vue.ref<TransactionalEmailConfig>()
const loading = vue.ref(true)

async function setEmail(campaignConfig?: EmailCampaignConfig) {
  const org = fictionUser.activeOrganization.value

  if (!campaignConfig || !org) {
    emailHtml.value = ''
    return
  }

  const conf = await getEmailForCampaign({ campaignConfig, fictionSend, org, withDefaults: true })

  const { useRender } = await import('vue-email')
  const EmailStandard = vue.defineAsyncComponent(() => import('@fiction/core/plugin-email/templates/EmailStandard.vue'))

  const r = await useRender(EmailStandard, { props: emailConfig.value })
  conf.bodyHtml = r.html

  emailConfig.value = conf

  loading.value = false
}

vue.onMounted(async () => {
  await fictionUser.userInitialized()

  vue.watch(() => modelValue, v => setEmail(v), { immediate: true })
})
</script>

<template>
  <div class="py-6">
    <div v-if="loading" class="p-12 flex justify-center">
      <ElSpinner class="size-8" />
    </div>
    <div v-else-if="emailConfig" class="border-b border-theme-200 dark:border-theme-700/70 mb-8 pb-8">
      <div class=" mb-6">
        <div class="text-3xl font-medium x-font-title">
          {{ emailConfig.subject }}
        </div>
        <div class="text-sm text-theme-500 dark:text-theme-400">
          {{ emailConfig.preview }}
        </div>
      </div>
      <div class="flex gap-4">
        <div><ElAvatar class="size-12 rounded-full" :url="emailConfig.avatarUrl" /></div>
        <div>
          <div class="font-medium">
            {{ emailConfig.fromName }}
          </div>
          <div class="text-sm text-theme-500 dark:text-theme-400">
            {{ emailConfig.fromEmail }}
          </div>
        </div>
      </div>
    </div>
    <div v-if="!emailHtml">
      No HTML to preview
    </div>
    <iframe v-else class="h-[800px] w-full" :srcdoc="emailHtml" />
  </div>
</template>
