<script lang="ts" setup>
import { dayjs, gravatarUrlSync, useService, vue } from '@fiction/core'
import type { ActionItem, IndexItem } from '@fiction/core'
import type { Card } from '@fiction/site'
import type { FictionSubscribe, Subscriber } from '@fiction/plugin-subscribe'
import ElIndexGrid from '@fiction/ui/lists/ElIndexGrid.vue'
import ElZeroBanner from '@fiction/ui/ElZeroBanner.vue'
import ElAvatar from '@fiction/ui/common/ElAvatar.vue'
import WidgetArea from '@fiction/admin/dashboard/WidgetArea.vue'

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

    if (p.inlineTags)
      desc.push(`Tags: ${p.inlineTags.join(', ')}`)

    if (!name.includes('@'))
      desc.push(`Email: ${p.email}`)

    return {
      key: p.subscriptionId,
      name,
      desc: desc.join(' | '),
      href: props.card.link(`/subscriber-view?subscriptionId=${p.subscriptionId}`),
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

const actions: ActionItem[] = [
  {
    name: 'Add / Import Subscribers',
    href: props.card.link('/audience-manage/import'),
    btn: 'primary',
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
      @update:offset="load({ offset: $event })"
    >
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
      <template #sidebar>
        <WidgetArea location="subscriberIndex" :card />
      </template>
      <template #zero>
        <ElZeroBanner
          title="No Subscribers Yet"
          description="Quickly create your audience by importing your list or capturing emails on your site."
          icon="i-tabler-users"
          :actions
        />
      </template>
    </ElIndexGrid>
  </div>
</template>
