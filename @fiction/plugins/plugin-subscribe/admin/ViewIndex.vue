<script lang="ts" setup>
import { useService, vue } from '@fiction/core'
import type { ActionItem, IndexItem } from '@fiction/core'
import type { Card } from '@fiction/site'
import type { FictionSubscribe, Subscriber } from '@fiction/plugin-subscribe'
import ElIndexGrid from '@fiction/ui/lists/ElIndexGrid.vue'
import ElZeroBanner from '@fiction/ui/ElZeroBanner.vue'
import ElAvatar from '@fiction/ui/common/ElAvatar.vue'

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
    return {
      key: p.subscriptionId,
      name: p.user.fullName || p.user.email,
      desc: p.user.email,
      href: props.card.link(`/subscriber-view?subscriptionId=${p.subscriptionId}`),
      media: p.user.avatar || '',
    } as IndexItem
  })
})

const loading = vue.ref(true)
async function load() {
  loading.value = true
  const endpoint = service.fictionSubscribe.requests.ManageSubscription
  const publisherId = service.fictionUser.activeOrgId.value
  const r = await endpoint.projectRequest({ _action: 'list', where: { publisherId } })
  console.log('SUBS', r)
  subscribers.value = r.data || []
  loading.value = false
}

vue.onMounted(async () => {
  vue.watch(() => service.fictionSubscribe.cacheKey.value, load, { immediate: true })
})

const actions: ActionItem[] = [
  {
    name: 'Add / Import Subscribers',
    href: props.card.link('/subscriber-manage/import'),
    btn: 'primary',
    icon: 'i-tabler-plus',
  },
]
</script>

<template>
  <div :class="card.classes.value.contentWidth">
    <ElIndexGrid :list="list" :loading="loading" :actions list-title="Subscribers">
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
          title="No Subscribers Yet"
          description="Quickly create your audience by importing your list or capturing emails on your site."
          icon="i-tabler-users"
          :actions
        />
      </template>
    </ElIndexGrid>
  </div>
</template>
