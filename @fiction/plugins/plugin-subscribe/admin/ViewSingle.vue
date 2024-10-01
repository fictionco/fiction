<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { FictionSubscribe, Subscriber } from '../index.js'
import ElHeader from '@fiction/admin/settings/ElHeader.vue'
import SettingsContentWrap from '@fiction/admin/settings/SettingsContentWrap.vue'
import { deepMerge, gravatarUrlSync, type User, useService, vue } from '@fiction/core'
import { InputOption } from '@fiction/ui/index.js'
import FormEngine from '@fiction/ui/inputs/FormEngine.vue'

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

const user = vue.computed(() => {
  const s = subscriber.value
  return deepMerge([s, s.user, s.inlineUser]) as User
})

function getSubscriberUser(subscriber: Subscriber) {
  return deepMerge([subscriber, subscriber.user, subscriber.inlineUser]) as User
}

function getAvatarUrl(user: User) {
  return user.avatar ? user.avatar : (gravatarUrlSync(user.email, { size: 400, default: 'identicon' }))
}

const options = vue.computed(() => {
  return [
    new InputOption({
      key: 'userDetails',
      label: 'Subscriber',
      input: 'group',
      options: [
        new InputOption({ key: 'email', label: 'Email', input: 'InputEmail' }),
        new InputOption({ key: 'status', label: 'Status', input: 'InputSelectCustom', list: ['active', 'unsubscribed', 'cleaned'] }),
        new InputOption({ key: 'inlineTags', label: 'Tags', input: 'InputItems', placeholder: 'Tag, Tag, Tag' }),
      ],
    }),
    new InputOption({
      key: 'userDetails',
      label: 'User Details',
      input: 'group',
      options: [
        new InputOption({ key: 'inlineUser.fullName', label: 'Full Name', input: 'InputText', placeholder: 'Your Full Name' }),
        new InputOption({ key: 'inlineUser.avatar', label: 'Avatar', input: 'InputMediaUpload', subLabel: 'Upload a square image or it will be cropped' }),
        new InputOption({ key: 'inlineUser.phone', label: 'Phone Number', description: 'Include country code. Used for 2FA and notifications.', input: 'InputPhone', placeholder: '+1 555 555 5555' }),
      ],
    }),
  ]
})
</script>

<template>
  <SettingsContentWrap
    :card
    :header="user.fullName || user.email"
    :sub-header="card.title.value"
    :avatar="getAvatarUrl(user)"
  >
    <FormEngine
      v-model="subscriber"
      state-key="settingsTool"
      input-wrap-class="max-w-lg w-full"
      ui-size="lg"
      :options
      :card
      :disable-group-hide="true"
      :data-value="JSON.stringify(subscriber)"
    />
  </SettingsContentWrap>
</template>
