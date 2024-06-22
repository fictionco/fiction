<script lang="ts" setup>
import type { IndexItem } from '@fiction/core'
import { useService, vue } from '@fiction/core'
import ElAvatar from '@fiction/ui/common/ElAvatar.vue'
import ElIndexGrid from '@fiction/ui/lists/ElIndexGrid.vue'
import type { Card } from '@fiction/site/card'
import ElZeroBanner from '@fiction/ui/ElZeroBanner.vue'
import { manageEmailSend } from '../utils.js'
import type { FictionSend } from '../index.js'
import type { Email } from '../email.js'

const props = defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
})

const { fictionSend } = useService<{ fictionSend: FictionSend }>()

const emails = vue.shallowRef<Email[]>([])

const list = vue.computed<IndexItem[]>(() => {
  return emails.value.map((email) => {
    const p = email.post.value
    return {
      ...email.toConfig(),
      key: email.emailId,
      name: email.title.value || p.title.value || 'Untitled',
      desc: p.subTitle.value || 'No description',
      href: props.card.link(`/email-manage?emailId=${email.emailId}`),
      media: p.image.value,
    } as IndexItem
  })
})

const loading = vue.ref(true)
async function load() {
  loading.value = true
  console.warn('load index', fictionSend.cacheKey.value)
  const createParams = { _action: 'list', fields: { }, loadDraft: true } as const
  emails.value = await manageEmailSend({ params: createParams, fictionSend })
  loading.value = false
}

vue.onMounted(async () => {
  vue.watch(() => fictionSend.cacheKey.value, load, { immediate: true })
})

const href = props.card.link('/email-edit')
</script>

<template>
  <div :class="card.classes.value.contentWidth">
    <ElIndexGrid media-icon="i-tabler-mail" list-title="Emails" :list="list" :loading="loading" :actions="[{ name: 'New Email', icon: 'i-tabler-plus', btn: 'primary', href }]">
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
          title="Create Your First Email Campaign"
          description="Quickly send a message to your subscribers."
          icon="i-tabler-mail-share"
          :actions="[{ name: 'Start', href, btn: 'primary', icon: 'i-heroicons-plus' }]"
        />
      </template>
    </ElIndexGrid>
  </div>
</template>import { manageEmailSend } from '../utils.js'import { manageEmailSend } from '../utils.js'import { manageEmailSend } from '../utils.js'
