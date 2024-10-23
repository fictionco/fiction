<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { EmailCampaign } from '../campaign.js'
import type { FictionNewsletter } from '../index.js'
import ElSavingSignal from '@fiction/admin/el/ElSavingSignal.vue'
import ViewEditor from '@fiction/admin/ViewEditor.vue'
import CardButton from '@fiction/cards/CardButton.vue'
import CardLink from '@fiction/cards/el/CardLink.vue'
import { useService, vue } from '@fiction/core'
import ElPostEditor from '@fiction/posts/el/ElPostEditor.vue'
import ElActions from '@fiction/ui/buttons/ElActions.vue'
import XText from '@fiction/ui/common/XText.vue'
import { loadEmail } from '../utils.js'
import { emailComposeController } from './tools'

const { card } = defineProps<{
  card: Card
}>()

const { fictionNewsletter, fictionRouter } = useService<{ fictionNewsletter: FictionNewsletter }>()

const loading = vue.ref(true)
const campaign = vue.shallowRef<EmailCampaign>()
const sending = vue.ref('')

const manageLink = vue.computed(() => {
  const campaignId = campaign.value?.campaignId

  if (!campaignId)
    return '/campaigns'

  return `/manage-newsletter?campaignId=${campaignId}`
})

vue.onMounted(async () => {
  vue.watch(() => fictionRouter.query.value.campaignId, async (v, old) => {
    if (!v || v === old)
      return

    loading.value = true

    campaign.value = await loadEmail({ fictionNewsletter, campaignId: v as string })

    loading.value = false
  }, { immediate: true })
})

const actions = vue.computed(() => {
  return campaign.value?.userConfig.value.actions || []
})

async function saveBeforeNavigate(args: { location: string, href: string }) {
  sending.value = args.location

  if (campaign.value?.saveUtility.isDirty.value)
    await campaign.value?.save({ disableNotify: true })

  sending.value = ''
  await card.goto(args.href)
}
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
            size="md"
            class="shrink-0"
            icon="i-tabler-arrow-left"
            :loading="sending === 'manage-newsletter-back'"
            @click.prevent="saveBeforeNavigate({ location: 'manage-newsletter-back', href: manageLink })"
          >
            Back
          </CardButton>
        </div>
        <div v-if="campaign" class="flex space-x-1 font-medium">
          <CardLink
            :card
            class=" whitespace-nowrap text-theme-400 dark:text-theme-300  pr-1 hover:text-primary-500 dark:hover:text-theme-0 flex items-center gap-1.5"
            href="/send"
          >
            <span class="i-tabler-mail text-xl inline-block dark:text-theme-500" />
            <span>Newsletter Composer</span>
            <span class="i-tabler-slash text-xl dark:text-theme-500" />
          </CardLink>
          <XText :model-value="campaign?.title.value" class="whitespace-nowrap" :is-editable="true" @update:model-value="campaign && (campaign.title.value = $event)" />
        </div>
      </template>
      <template #headerRight>
        <ElSavingSignal
          v-if="campaign"
          :is-dirty="campaign?.saveUtility.isDirty.value"
          data-test-id="draft-control-dropdown"
          change-type="publish"
        />
        <CardButton
          :card
          theme="primary"
          design="outline"
          size="md"
          class="shrink-0"
          icon-after="i-tabler-arrow-right"
          :loading="sending === 'manage-newsletter-review'"
          @click.prevent="saveBeforeNavigate({ location: 'manage-newsletter-review', href: manageLink })"
        >
          Review &amp; Send
        </CardButton>
      </template>
      <template #default>
        <div v-if="campaign?.post.value">
          <ElPostEditor :post="campaign.post.value" :card @update:post="campaign.saveUtility.autosave()">
            <template #footer>
              <div v-if="actions.length" class="mt-12 pt-12">
                <ElActions :actions ui-size="xl" class="flex gap-4" />
              </div>
            </template>
          </ElPostEditor>
        </div>
      </template>
    </ViewEditor>
  </div>
</template>
