<script lang="ts" setup>
import { useService, vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import ViewEditor from '@fiction/admin/ViewEditor.vue'
import ElButton from '@fiction/ui/ElButton.vue'
import XText from '@fiction/ui/common/XText.vue'
import ElPostEditor from '@fiction/posts/el/ElPostEditor.vue'
import ElActions from '@fiction/ui/buttons/ElActions.vue'
import type { FictionSend } from '../index.js'
import { loadEmail } from '../utils.js'
import type { EmailCampaign } from '../campaign.js'
import { emailComposeController } from './tools'

const props = defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
})

const { fictionSend, fictionRouter } = useService<{ fictionSend: FictionSend }>()

const loading = vue.ref(true)
const sending = vue.ref()
const campaign = vue.shallowRef<EmailCampaign>()

const manageLink = vue.computed(() => {
  const campaignId = campaign.value?.campaignId

  if (!campaignId)
    return props.card.link('/send')

  return props.card.link({ path: '/campaign-manage', query: { campaignId } })
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
          <ElButton btn="default" size="sm" :href="card.link('/')" class="shrink-0" icon="i-tabler-home">
            Home
          </ElButton>
          <ElButton btn="default" size="sm" :href="manageLink" class="shrink-0" icon="i-tabler-arrow-left">
            Manage
          </ElButton>
        </div>
        <div v-if="campaign" class="flex space-x-1 font-medium">
          <RouterLink
            class=" whitespace-nowrap text-theme-400 dark:text-theme-300  pr-1 hover:text-primary-500 dark:hover:text-theme-0 flex items-center gap-1.5"
            :to="card.link('/send')"
          >
            <span class="i-tabler-mail text-xl inline-block dark:text-theme-500" />
            <span>Compose Email</span>
            <span class="i-tabler-slash text-xl dark:text-theme-500" />
          </RouterLink>
          <XText :model-value="campaign?.title.value" class="whitespace-nowrap" :is-editable="true" @update:model-value="campaign && (campaign.title.value = $event)" />
        </div>
      </template>
      <template #headerRight>
        <span class="inline-flex items-center gap-x-1.5 rounded-md  px-2 py-1 text-xs font-medium text-theme-400 antialiased">
          <svg class="h-1.5 w-1.5" :class="campaign?.post.value?.isDirty.value ? 'fill-orange-500' : 'fill-green-500'" viewBox="0 0 6 6" aria-hidden="true">
            <circle cx="3" cy="3" r="3" />
          </svg>
          {{ campaign?.post.value?.isDirty.value ? 'Syncing' : 'Draft Saved' }}
        </span>
        <ElButton
          btn="primary"
          class="min-w-36"
          size="md"
          :loading="!!sending"
          @click.stop.prevent="publish()"
        >
          Save
        </ElButton>
      </template>
      <template #default>
        <div v-if="campaign?.post.value">
          <ElPostEditor :post="campaign.post.value" :card="card">
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
