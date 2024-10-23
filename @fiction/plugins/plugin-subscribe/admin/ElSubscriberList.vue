<script lang="ts" setup>
import type { ActionButton, IndexItem } from '@fiction/core'
import type { FictionSubscribe, Subscriber } from '@fiction/plugin-subscribe'
import type { Card } from '@fiction/site'
import { dayjs, gravatarUrlSync, useService, vue } from '@fiction/core'
import ElIndexGrid from '@fiction/ui/lists/ElIndexGrid.vue'

type UserConfig = {
  isNavItem: boolean
}
const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const service = useService<{ fictionSubscribe: FictionSubscribe }>()

const subscribers = vue.shallowRef<Subscriber[]>([])

const list = vue.computed<IndexItem[]>(() => {
  return subscribers.value.map((p) => {
    const name = p.user?.fullName || p.user?.email || p.email || 'Unknown'
    const desc = [`Added ${dayjs(p.createdAt).format('MMM D, YYYY')}`]

    if (p.tags)
      desc.push(`Tags: ${p.tags.join(', ')}`)

    if (!name.includes('@'))
      desc.push(`Email: ${p.email}`)

    return {
      key: p.subscriptionId,
      name,
      desc: desc.join(' | '),
      href: props.card.link(`/audience/view?subscriptionId=${p.subscriptionId}`),
      media: p.user?.avatar || p.avatar,
    } as IndexItem
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
})

const actions: ActionButton[] = [
  {
    testId: 'add-subscribers-button',
    name: 'Add Subscribers to Audience',
    href: props.card.link('/audience/add'),
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
      :actions
      list-title="Subscribers"
      :index-meta="indexMeta"
      :empty="{
        testId: 'subscriber-list-empty',
        name: 'Your Subscribers',
        desc: 'Import your email list or start capturing emails on your site.',
        icon: 'i-tabler-users',
        actions,
      }"
      @update:offset="load({ offset: $event })"
    />
  </div>
</template>
