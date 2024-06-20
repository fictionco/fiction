<script lang="ts" setup>
import { useService, vue, waitFor } from '@fiction/core'
import type { Card } from '@fiction/site'
import ViewEditor from '@fiction/admin/ViewEditor.vue'
import ElButton from '@fiction/ui/ElButton.vue'
import XText from '@fiction/ui/common/XText.vue'
import ElModal from '@fiction/ui/ElModal.vue'
import InputDate from '@fiction/ui/inputs/InputDate.vue'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import ElPostEditor from '@fiction/posts/el/ElPostEditor.vue'
import type { FictionSend } from '../index.js'
import type { Email } from '../email.js'
import { postEditController } from './tools'

defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
})

type PostFromEditor = InstanceType<typeof ElPostEditor>['$props']['post']

const service = useService<{ fictionSend: FictionSend }>()

const loading = vue.ref(true)
const sending = vue.ref()
const email = vue.shallowRef<Email | undefined>()
const publishItemSelected = vue.ref<string | undefined>()

const vis = vue.ref(false)

async function publish() {
  if (!email.value)
    return
  sending.value = 'publish'

  // min 1 second for UX reasons
  await waitFor(500)

  await email.value.save()

  sending.value = ''
  vis.value = false
  publishItemSelected.value = undefined
}

async function load() {
  loading.value = true
  const rtr = service.fictionRouter
  const emailId = rtr.query.value.emailId as string | undefined

  if (!emailId) {
    const [_email] = await service.fictionSend.manageEmailSend({ _action: 'create', fields: [{}] })

    rtr.replace({ query: { emailId: _email?.emailId } })
  }
  else {
    const [_email] = await service.fictionSend.manageEmailSend({ _action: 'get', where: { emailId }, loadDraft: true })
    email.value = _email
  }
  loading.value = false
}

vue.onMounted(async () => {
  await load()
})
</script>

<template>
  <div v-if="email?.post.value">
    <ViewEditor :tool-props="{ card }" :controller="postEditController" :loading="loading">
      <template #headerLeft>
        <ElButton btn="default" :href="card.link('/')" class="shrink-0">
          <div class="i-tabler-home text-lg" />
        </ElButton>
        <div class="flex space-x-1 font-medium">
          <RouterLink
            class=" whitespace-nowrap text-theme-400 dark:text-theme-300  pr-1 hover:text-primary-500 dark:hover:text-theme-0 flex items-center gap-1"
            :to="card.link('/send')"
          >
            <span class="i-tabler-pin text-xl inline-block dark:text-theme-500" />
            <span>Edit Email</span>
            <span class="i-tabler-slash text-xl dark:text-theme-500" />
          </RouterLink>
          <XText v-if="email" :model-value="email.title.value" class="whitespace-nowrap" :is-editable="true" />
        </div>
      </template>
      <template #headerRight>
        <span class="inline-flex items-center gap-x-1.5 rounded-md  px-2 py-1 text-xs font-medium text-theme-400 antialiased">
          <svg class="h-1.5 w-1.5" :class="email?.post.value?.isDirty.value ? 'fill-orange-500' : 'fill-green-500'" viewBox="0 0 6 6" aria-hidden="true">
            <circle cx="3" cy="3" r="3" />
          </svg>
          {{ email?.post.value?.isDirty.value ? 'Syncing' : 'Draft Saved' }}
        </span>
        <ElButton
          btn="primary"
          :loading="sending === 'publish'"
          class="min-w-36"
          icon="i-tabler-arrow-big-up-lines"
          size="md"
          @click.stop.prevent="publish()"
        >
          Save Changes
        </ElButton>
      </template>
      <template #default>
        <div v-if="email.post.value">
          <ElPostEditor :post="email.post.value" :card="card" />
        </div>
      </template>
    </ViewEditor>
    <ElModal v-model:vis="vis" modal-class="max-w-screen-md p-24 ">
      <div v-if="email" class="relative max-w-xl mx-auto">
        <div class="text-center mb-8 ">
          <div class="text-2xl font-bold antialiased dark:text-theme-0 mb-4 text-balance">
            <template v-if="publishItemSelected === 'publish'">
              Publish Now
            </template>
            <template v-else-if="publishItemSelected === 'schedule'">
              Select Publication Time
            </template>
            <template v-else>
              This post is in draft.
            </template>
          </div>
          <div class="text-base font-medium text-theme-500 dark:text-theme-300 text-balance">
            <template v-if="publishItemSelected === 'publish'">
              This action will publish now the post and syndicate it to your audience (based on your settings).
            </template>
            <template v-else-if="publishItemSelected === 'schedule'">
              This will schedule the post to be published at the selected time.
            </template>
            <template v-else>
              Publish to go live and syndicate to your audience (based on your settings).
            </template>
          </div>
        </div>
        <div v-if="!publishItemSelected" class="space-y-6">
          <div class="flex justify-center gap-6">
            <ElButton size="md" icon="i-tabler-calendar-bolt" @click="publishItemSelected = 'schedule'">
              Schedule Publication
            </ElButton>
            <ElButton size="md" btn="primary" icon="i-tabler-arrow-big-up-lines" :loading="sending === 'publish'" @click="publish()">
              Publish Now
            </ElButton>
          </div>
        </div>

        <div v-else-if="publishItemSelected === 'schedule'" class="mx-auto max-w-sm">
          <ElForm class=" space-y-6" @submit="publish()">
            <InputDate v-model="email.scheduledAt.value" :include-time="true" required date-mode="future" />
            <div class="flex justify-center gap-6">
              <ElButton v-if="publishItemSelected" size="md" @click="publishItemSelected = ''">
                &larr; Back
              </ElButton>
              <ElButton size="md" btn="primary" icon="i-tabler-calendar-bolt" type="submit" :loading="sending === 'publish'">
                Schedule Publication
              </ElButton>
            </div>
          </ElForm>
        </div>
      </div>
    </ElModal>
  </div>
</template>
