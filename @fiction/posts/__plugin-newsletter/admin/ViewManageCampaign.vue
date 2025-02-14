<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { FictionNewsletter } from '..'
import SettingsBoard from '@fiction/admin/settings/SettingsBoard.vue'
import { useService, vue } from '@fiction/core'
import { EmailCampaign } from '../campaign'

const { card } = defineProps<{ card: Card }>()
const loading = vue.ref(true)

const { fictionNewsletter, fictionRouter } = useService<{ fictionNewsletter: FictionNewsletter }>()

const campaign = vue.shallowRef<EmailCampaign>()

async function load() {
  loading.value = true

  const campaignId = fictionRouter.query.value.campaignId as string | undefined

  try {
    if (!campaignId)
      return

    const endpoint = fictionNewsletter.requests.ManageCampaign

    const r = await endpoint.projectRequest({ _action: 'get', where: { campaignId } })

    if (!r.data || !r.data.length)
      throw new Error('No campaign found')

    campaign.value = new EmailCampaign({ fictionNewsletter, ...r.data[0] })

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
  <SettingsBoard
    :loading
    :card
    base-path="/manage-newsletter"
    :panel-props="{ campaign }"
    :header="{
      title: campaign?.title.value || 'Untitled',
      subTitle: 'A simple way to send beautiful emails to your email list.',
      media: { class: `i-tabler-mail` },
    }"
    :nav-actions="[
      {
        label: 'All Campaigns',
        theme: 'default',
        size: 'sm',
        href: card.link('/newsletter'),
        icon: 'i-tabler-arrow-left',
      },
    ]"
  />
</template>
