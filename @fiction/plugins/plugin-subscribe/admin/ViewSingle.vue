<script lang="ts" setup>
import SettingsTool from '@fiction/admin/settings/SettingsTool.vue'
import { useService, vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import { getViewSubscriberTools } from './tools.js'
import type { FictionSubscribe, Subscriber } from '../index.js'

type UserConfig = {
  isNavItem: boolean
}
defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})
const service = useService<{ fictionSubscribe: FictionSubscribe }>()

const loading = vue.ref(true)

const subscriber = vue.ref<Subscriber>({})

async function load() {
  loading.value = true

  const subscriptionId = service.fictionRouter.query.value.subscriptionId as string | undefined

  try {
    if (!subscriptionId)
      return

    const endpoint = service.fictionSubscribe.requests.ManageSubscription
    const orgId = service.fictionUser.activeOrgId.value
    if (!orgId)
      throw new Error('No orgId')

    const r = await endpoint.projectRequest({ _action: 'list', where: { subscriptionId } })

    if (!r.data || !r.data.length)
      throw new Error('No subscriber found')

    subscriber.value = r.data[0]

    console.warn('Loaded subscriber', subscriber.value)
  }
  catch (error) {
    console.error('Error loading subscriber', error)
  }
  finally {
    loading.value = false
  }
}

vue.onMounted(() => load())

const tools = getViewSubscriberTools({ fictionSubscribe: service.fictionSubscribe, subscriber })
</script>

<template>
  <SettingsTool base-path="/subscriber-view" :tools :card :loading :class="card.classes.value.contentWidth" />
</template>
