<script lang="ts" setup>
import type { ActionButton, NavListItem, StandardSize } from '@fiction/core'
import type { FictionSubscribe, Subscriber } from '@fiction/plugin-subscribe'
import type { Card } from '@fiction/site'
import { dayjs, gravatarUrlSync, useService, vue } from '@fiction/core'
import ElIndexGrid from '@fiction/ui/lists/ElIndexGrid.vue'
import ElAddContactsModal from './ElAddContactsModal.vue'

const { card, uiSize = 'md' } = defineProps<{
  card: Card
  uiSize?: StandardSize
}>()

const service = useService<{ fictionSubscribe: FictionSubscribe }>()

const subscribers = vue.shallowRef<Subscriber[]>([])

const showAddContactsModal = vue.ref(false)

const list = vue.computed<NavListItem[]>(() => {
  const querySubscriptionId = card.site?.siteRouter.query.value.itemId as string | undefined
  return subscribers.value.map((p) => {
    const label = p.user?.fullName || p.user?.email || p.email || 'Unknown'
    const description = [`Added ${dayjs(p.createdAt).format('MMM D, YYYY')}`]

    if (p.tags?.filter(Boolean).length)
      description.push(`Tags: ${p.tags.join(', ')}`)

    if (!label.includes('@'))
      description.push(`Email: ${p.email}`)

    return {
      key: p.subscriptionId,
      label,
      description: description.join(' | '),
      href: card.link(`/audience/view?itemId=${p.subscriptionId}`),
      media: p.user?.avatar || p.avatar,
      isActive: querySubscriptionId && querySubscriptionId === p.subscriptionId,
    } as NavListItem
  })
})

async function addAvatarUrl(subscribers?: Subscriber[]) {
  if (!subscribers || !subscribers.length)
    return []

  const promises = subscribers.map(async (sub) => {
    if (sub.user?.avatar)
      return sub

    const email = sub.user?.email || sub.email

    const avatar = await gravatarUrlSync(email, { size: 200 })
    return { ...sub, user: { ...sub.user, avatar } }
  })

  return Promise.all(promises)
}

const loading = vue.ref(true)
const indexMeta = vue.ref()
async function load(args: { offset?: number, limit?: number } = {}) {
  loading.value = true

  try {
    const { offset = 0, limit = 40 } = args
    const endpoint = service.fictionSubscribe.requests.ManageSubscription
    const orgId = service.fictionUser.activeOrgId.value
    if (!orgId)
      throw new Error('No orgId')

    const r = await endpoint.projectRequest({ _action: 'list', offset, limit })

    indexMeta.value = r.indexMeta

    subscribers.value = await addAvatarUrl(r.data || [])
  }
  catch (error) {
    console.error('Error loading subscribers', error)
  }
  finally {
    loading.value = false
  }
}

vue.onMounted(async () => {
  vue.watch(() => service.fictionSubscribe.cacheKey.value, () => load(), { immediate: true })

  vue.watchEffect(() => {
    const queryVal = card.site?.siteRouter.query.value
    if (card.site && queryVal?.addNew) {
      showAddContactsModal.value = true
      delete queryVal.addNew
      card.site.siteRouter.query.value = queryVal
    }
  })
})

const buttons: ActionButton[] = [
  {
    testId: 'add-subscribers-button',
    label: 'Add Contacts',
    onClick: () => (showAddContactsModal.value = true),
    theme: 'primary',
    icon: 'i-tabler-plus',
  },
]
</script>

<template>
  <div>
    <ElIndexGrid
      :list
      :loading
      :action="{ buttons }"
      list-title="Contacts"
      :index-meta="indexMeta"
      theme="cyan"
      :ui-size="uiSize"
      :empty="{
        testId: 'subscriber-list-empty',
        title: 'Your Contacts',
        subTitle: 'Add or import email contacts to send newsletters and updates.',
        media: { class: 'i-tabler-users' },
        action: { buttons },
      }"
      @update:offset="load({ offset: $event })"
    />
    <ElAddContactsModal v-model:vis="showAddContactsModal" :card />
  </div>
</template>
