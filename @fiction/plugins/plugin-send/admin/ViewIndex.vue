<script lang="ts" setup>
import type { IndexItem } from '@fiction/core'
import type { Card } from '@fiction/site/card'
import type { EmailCampaign } from '../campaign.js'
import type { FictionSend } from '../index.js'
import { useService, vue } from '@fiction/core'
import ElAvatar from '@fiction/ui/common/ElAvatar.vue'
import ElZeroBanner from '@fiction/ui/ElZeroBanner.vue'
import ElIndexGrid from '@fiction/ui/lists/ElIndexGrid.vue'
import { manageEmailCampaign } from '../utils.js'
import ElStart from './ElStart.vue'

const props = defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
})

const { fictionSend, fictionRouter } = useService<{ fictionSend: FictionSend }>()

const campaigns = vue.shallowRef<EmailCampaign[]>([])

const list = vue.computed<IndexItem[]>(() => {
  return campaigns.value.map((campaign) => {
    const p = campaign.post.value
    return {
      ...campaign.toConfig(),
      key: campaign.campaignId,
      name: campaign.title.value || p.title.value || 'Untitled',
      desc: p.subTitle.value || 'No description',
      href: props.card.link(`/manage-campaign?campaignId=${campaign.campaignId}`),
      media: p.media.value,
      icon: 'i-tabler-mail',
    } as IndexItem
  })
})

const loading = vue.ref(true)
async function load() {
  loading.value = true
  console.warn('load index', fictionSend.cacheKey.value)
  const createParams = { _action: 'list', fields: { }, loadDraft: true } as const
  campaigns.value = await manageEmailCampaign({ params: createParams, fictionSend })
  loading.value = false
}
const showStartModal = vue.ref(false)

vue.onMounted(async () => {
  vue.watch(() => fictionSend.cacheKey.value, load, { immediate: true })

  vue.watchEffect(() => {
    if (fictionRouter.query.value.addEmail) {
      showStartModal.value = true
      fictionRouter.query.value = { }
    }
  })
})
</script>

<template>
  <div class="p-12 w-full max-w-screen-md mx-auto">
    <ElIndexGrid media-icon="i-tabler-mail" list-title="Newsletter Campaigns" :list="list" :loading="loading" :actions="[{ name: 'New Campaign', icon: 'i-tabler-plus', theme: 'primary', onClick: () => { showStartModal = true } }]">
      <template #item="{ item }">
        <div class="flex -space-x-0.5">
          <dt class="sr-only">
            Authors
          </dt>
          <dd v-for="(member, ii) in item.authors" :key="ii">
            <ElAvatar class="h-6 w-6 rounded-full bg-theme-50 ring-2 ring-white" :email="member.email" />
          </dd>
        </div>
      </template>
      <template #zero>
        <ElZeroBanner
          title="Your Newsletter"
          description="Quickly craft emails and send them to your subscribers."
          icon="i-tabler-mail-share"
          :actions="[{ name: 'Create Campaign', onClick: () => { showStartModal = true }, theme: 'primary', icon: 'i-heroicons-plus' }]"
        />
      </template>
    </ElIndexGrid>
    <ElStart v-model:vis="showStartModal" :card />
  </div>
</template>
