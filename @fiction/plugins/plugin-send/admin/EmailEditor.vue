<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { EmailCampaign } from '../campaign.js'
import type { FictionSend } from '../index.js'
import ElDraftSignal from '@fiction/admin/el/ElDraftSignal.vue'
import ViewEditor from '@fiction/admin/ViewEditor.vue'
import CardButton from '@fiction/cards/CardButton.vue'
import CardLink from '@fiction/cards/el/CardLink.vue'
import { useService, vue } from '@fiction/core'
import ElPostEditor from '@fiction/posts/el/ElPostEditor.vue'
import ElActions from '@fiction/ui/buttons/ElActions.vue'
import XText from '@fiction/ui/common/XText.vue'
import { loadEmail } from '../utils.js'
import { emailComposeController } from './tools'

defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
})

const { fictionSend, fictionRouter } = useService<{ fictionSend: FictionSend }>()

const loading = vue.ref(true)
const sending = vue.ref()
const campaign = vue.shallowRef<EmailCampaign>()

const manageLink = vue.computed(() => {
  const campaignId = campaign.value?.campaignId

  if (!campaignId)
    return '/campaigns'

  return `/manage-campaign?campaignId=${campaignId}`
})
async function publish() {
  if (!campaign.value)
    return
  sending.value = 'publish'

  await campaign.value.save()

  sending.value = ''

  // await props.card.goto(manageLink.value, { caller: 'send' })
}

vue.onMounted(async () => {
  vue.watch(() => fictionRouter.query.value.campaignId, async (v, old) => {
    if (!v || v === old)
      return

    loading.value = true

    campaign.value = await loadEmail({ fictionSend, campaignId: v as string })

    loading.value = false
  }, { immediate: true })
})

const actions = vue.computed(() => {
  return campaign.value?.userConfig.value.actions || []
})
</script>

<template>
  <div>
    <ViewEditor :tool-props="{ card, campaign }" :controller="emailComposeController" :loading>
      <template #headerLeft>
        <div class="flex space-x-2 items-center">
          <CardButton
            :card
            theme="primary"
            design="outline"
            size="sm"
            href="/"
            class="shrink-0"
            icon="i-tabler-home"
          >
            Home
          </CardButton>
          <CardButton
            :card
            theme="green"
            design="outline"
            size="sm"
            :href="manageLink"
            class="shrink-0"
            icon="i-tabler-arrow-left"
          >
            Manage Campaign
          </CardButton>
        </div>
        <div v-if="campaign" class="flex space-x-1 font-medium">
          <CardLink
            :card
            class=" whitespace-nowrap text-theme-400 dark:text-theme-300  pr-1 hover:text-primary-500 dark:hover:text-theme-0 flex items-center gap-1.5"
            href="/send"
          >
            <span class="i-tabler-mail text-xl inline-block dark:text-theme-500" />
            <span>Email Campaign Composer</span>
            <span class="i-tabler-slash text-xl dark:text-theme-500" />
          </CardLink>
          <XText :model-value="campaign?.title.value" class="whitespace-nowrap" :is-editable="true" @update:model-value="campaign && (campaign.title.value = $event)" />
        </div>
      </template>
      <template #headerRight>
        <ElDraftSignal
          v-if="campaign?.post.value"
          :is-dirty="campaign?.post.value.isDirty.value"
          data-test-id="draft-control-dropdown"
          :nav-items="[
            {
              name: 'Reset to Published Version',
              onClick: () => campaign?.post.value.resetToPublished(),
              testId: 'reset-to-published',
            },
          ]"
        />
        <CardButton
          :card
          theme="primary"
          size="md"
          :loading="!!sending"
          @click.stop.prevent="publish()"
        >
          Publish Changes
        </CardButton>
      </template>
      <template #default>
        <div v-if="campaign?.post.value">
          <ElPostEditor :post="campaign.post.value" :card>
            <template #footer>
              <div v-if="actions.length" class="mt-12 pt-12 border-t border-theme-200 dark:border-theme-700">
                <ElActions :actions="actions" ui-size="lg" class="flex gap-4" />
              </div>
            </template>
          </ElPostEditor>
        </div>
      </template>
    </ViewEditor>
  </div>
</template>
