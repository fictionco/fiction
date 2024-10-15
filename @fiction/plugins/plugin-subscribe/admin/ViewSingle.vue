<script lang="ts" setup>
import type { Card } from '@fiction/site'
import type { FictionSubscribe, Subscriber } from '../index.js'
import ElHeader from '@fiction/admin/settings/ElHeader.vue'
import SettingsPanel from '@fiction/admin/settings/SettingsPanel.vue'
import { deepMerge, gravatarUrlSync, type User, useService, vue } from '@fiction/core'
import { AutosaveUtility } from '@fiction/core/utils/save.js'
import { InputOption } from '@fiction/ui/index.js'
import FormEngine from '@fiction/ui/inputs/FormEngine.vue'

type UserConfig = {
  isNavItem: boolean
}

const { card } = defineProps<{ card: Card<UserConfig> }>()
const service = useService<{ fictionSubscribe: FictionSubscribe }>()

const loading = vue.ref(true)
const sending = vue.ref('')

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

function getAvatarUrl(user: User) {
  return user.avatar ? user.avatar : (gravatarUrlSync(user.email, { size: 400, default: 'identicon' }))
}

async function saveSubscriber() {
  sending.value = 'saving'
  const endpoint = service.fictionSubscribe.requests.ManageSubscription
  const fields = subscriber.value
  const subscriptionId = fields.subscriptionId

  if (!subscriptionId)
    return

  await endpoint.projectRequest({ _action: 'update', fields, where: [{ subscriptionId }] })

  sending.value = ''
}

const saveUtil = new AutosaveUtility({
  onSave: () => saveSubscriber(),
})

function updateSubscriber(subscriberNew: Subscriber) {
  subscriber.value = subscriberNew

  saveUtil.autosave()
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
    new InputOption({
      key: 'userDanger',
      label: 'Danger Zone',
      input: 'group',
      options: [
        new InputOption({
          key: 'deleteSubscriber',
          label: 'Permanently Delete Subscriber',
          input: 'InputActionList',
          props: {
            actions: [
              {
                name: 'Delete Subscriber...',
                theme: 'rose',
                design: 'ghost',
                icon: 'i-tabler-trash',
                loading: loading.value,
                onClick: async () => {
                  const endpoint = service.fictionSubscribe.requests.ManageSubscription

                  const confirmed = confirm('Are you sure you want to delete this subscriber?')

                  if (confirmed && subscriber.value.subscriptionId) {
                    sending.value = 'delete'
                    await endpoint.projectRequest({ _action: 'delete', where: [{ subscriptionId: subscriber.value.subscriptionId }] })
                    await card.goto('/audience', { caller: 'deleteSubscriber' })
                    sending.value = ''
                  }
                },
              },
            ],
          },
        }),
      ],
    }),
  ]
})

const header = vue.computed(() => {
  return {
    title: user.value.fullName || user.value.email,
    subTitle: 'Subscriber Details',
    media: getAvatarUrl(user.value),
  }
})
</script>

<template>
  <SettingsPanel
    title="Subscriber Details"
    :actions="[{
      name: saveUtil.isDirty.value ? 'Saving...' : 'Saved',
      onClick: () => saveSubscriber(),
      theme: saveUtil.isDirty.value ? 'primary' : 'default',
      loading: sending === 'saving',
      icon: saveUtil.isDirty.value ? 'i-tabler-upload' : 'i-tabler-check',
    }]"
  >
    <div class="p-6">
      <ElHeader
        v-if="header"
        class="dark:bg-theme-700/50 rounded-xl p-8"
        :model-value="header"
      />
    </div>
    <FormEngine
      :model-value="subscriber"
      state-key="settingsTool"
      input-wrap-class="max-w-lg w-full"
      ui-size="lg"
      :options
      :card
      :disable-group-hide="true"
      :data-value="JSON.stringify(subscriber)"
      @update:model-value="updateSubscriber($event)"
    />
  </SettingsPanel>
</template>
