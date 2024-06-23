<script lang="ts" setup>
import { useService, vue, waitFor } from '@fiction/core'
import type { Card } from '@fiction/site'
import ViewEditor from '@fiction/admin/ViewEditor.vue'
import ElButton from '@fiction/ui/ElButton.vue'
import XText from '@fiction/ui/common/XText.vue'
import ElPostEditor from '@fiction/posts/el/ElPostEditor.vue'
import type { FictionSend } from '../index.js'
import { loadEmail } from '../utils.js'
import type { Email } from '../email.js'
import { postEditController } from './tools'

const props = defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
})

const { fictionSend, fictionRouter } = useService<{ fictionSend: FictionSend }>()

const loading = vue.ref(true)
const sending = vue.ref()
const email = vue.shallowRef<Email>()
async function publish() {
  if (!email.value)
    return
  sending.value = 'publish'

  // min 1 second for UX reasons
  await waitFor(500)

  await email.value.save()

  sending.value = ''

  await props.card.goto({ path: '/email-manage', query: { emailId: email.value.emailId } }, { caller: 'send' })
}

vue.onMounted(async () => {
  email.value = await loadEmail({ fictionSend })
  loading.value = false
})
</script>

<template>
  <div>
    <ViewEditor :tool-props="{ card, email }" :controller="postEditController" :loading>
      <template #headerLeft>
        <div class="flex space-x-2 items-center">
          <ElButton btn="default" :href="card.link('/')" class="shrink-0" icon="i-tabler-home" />
          <ElButton btn="default" :href="card.link('/send')" class="shrink-0" icon="i-tabler-arrow-left" />
        </div>
        <div v-if="email" class="flex space-x-1 font-medium">
          <RouterLink
            class=" whitespace-nowrap text-theme-400 dark:text-theme-300  pr-1 hover:text-primary-500 dark:hover:text-theme-0 flex items-center gap-1"
            :to="card.link('/send')"
          >
            <span class="i-tabler-pin text-xl inline-block dark:text-theme-500" />
            <span>Edit Email</span>
            <span class="i-tabler-slash text-xl dark:text-theme-500" />
          </RouterLink>
          <XText :model-value="email?.title.value" class="whitespace-nowrap" :is-editable="true" @update:model-value="email && (email.title.value = $event)" />
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
          class="min-w-36"
          icon-after="i-tabler-arrow-big-right-lines"
          size="md"
          @click.stop.prevent="publish()"
        >
          Continue
        </ElButton>
      </template>
      <template #default>
        <div v-if="email?.post.value">
          <ElPostEditor :post="email.post.value" :card="card" />
        </div>
      </template>
    </ViewEditor>
  </div>
</template>
