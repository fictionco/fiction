<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { FictionSend } from '..'
import SettingsPanel from '@fiction/admin/settings/SettingsPanel.vue'
import { useService, vue } from '@fiction/core'
import { EmailCampaign } from '../campaign'

const { card } = defineProps<{ card: Card }>()
const loading = vue.ref(true)

const { fictionSend, fictionRouter } = useService<{ fictionSend: FictionSend }>()

const campaign = vue.shallowRef<EmailCampaign>()

async function load() {
  loading.value = true

  const campaignId = fictionRouter.query.value.campaignId as string | undefined

  try {
    if (!campaignId)
      return

    const endpoint = fictionSend.requests.ManageCampaign

    const r = await endpoint.projectRequest({ _action: 'get', where: { campaignId } })

    if (!r.data || !r.data.length)
      throw new Error('No campaign found')

    campaign.value = new EmailCampaign({ fictionSend, ...r.data[0] })

    console.warn('Loaded email', campaign.value)
  }
  catch (error) {
    console.error('Error loading campaign', error)
  }
  finally {
    loading.value = false
  }
}

vue.onMounted(() => load())
</script>

<template>
  <SettingsPanel
    :loading
    :card
    base-path="/manage-campaign"
    :panel-props="{ campaign }"
    :header="{
      superTitle: 'Campaign',
      title: campaign?.title.value || 'Untitled',
      subTitle: 'A simple way to send beautiful emails to your email list.',
      media: { class: `i-tabler-mail` },
      actions: [],
    }"
  />
</template>
