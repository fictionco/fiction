<script lang="ts" setup>
import type { IndexItem } from '@fiction/core'
import { useService, vue } from '@fiction/core'
import ElAvatar from '@fiction/ui/common/ElAvatar.vue'
import ElIndexGrid from '@fiction/ui/lists/ElIndexGrid.vue'
import type { Card } from '@fiction/site/card'
import ElZeroBanner from '@fiction/ui/ElZeroBanner.vue'
import { manageEmailCampaign } from '../utils.js'
import type { FictionSend } from '../index.js'
import type { EmailCampaign } from '../campaign.js'
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
      href: props.card.link(`/campaign-manage?campaignId=${campaign.campaignId}`),
      media: p.image.value,
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
  <div :class="card.classes.value.contentWidth">
    <ElIndexGrid media-icon="i-tabler-mail" list-title="Emails" :list="list" :loading="loading" :actions="[{ name: 'New Email', icon: 'i-tabler-plus', btn: 'primary', onClick: () => { showStartModal = true } }]">
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
          title="Email Your Subscribers"
          description="Quickly emails and send them to your subscribers in a few clicks."
          icon="i-tabler-mail-share"
          :actions="[{ name: 'Start', onClick: () => { showStartModal = true }, btn: 'primary', icon: 'i-heroicons-plus' }]"
        />
      </template>
    </ElIndexGrid>
    <ElStart v-model:vis="showStartModal" :card="card" />
  </div>
</template>
