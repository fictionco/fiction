import type { FictionSubscribe } from '..'
import type { Subscriber } from '../schema'
import ElHeader from '@fiction/admin/settings/ElHeader.vue'
import { SettingsTool } from '@fiction/admin/types'

import { deepMerge, gravatarUrlSync, type StandardServices, type User, vue } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import ElImportFile from './ElImportFile.vue'

export function getTools(_args: { service: StandardServices }) {
  const tools = [
    new SettingsTool({
      title: 'Back',
      href: '/audience',
      userConfig: { isNavItem: true, navIcon: 'i-tabler-arrow-down-left', navIconAlt: 'i-tabler-arrow-left' },
    }),
    new SettingsTool({
      slug: 'import',
      title: 'Add Subscribers',
      userConfig: { isNavItem: true, navIcon: 'i-tabler-table-share', navIconAlt: 'i-tabler-table-plus' },
      options: (_args) => {
        return vue.computed(() => [new InputOption({ key: 'publication', input: ElImportFile })] satisfies InputOption[])
      },
    }),
  ] satisfies SettingsTool[]

  return tools
}

export async function saveSubscriber(args: { fictionSubscribe: FictionSubscribe, subscriber: Subscriber }) {
  const { fictionSubscribe, subscriber } = args
  const subscriptionId = subscriber.subscriptionId
  if (!subscriptionId)
    throw new Error('No subscriptionId found')

  const r = await fictionSubscribe.requests.ManageSubscription.projectRequest({ _action: 'update', where: [{ subscriptionId }], fields: subscriber })

  if (r.status === 'success' && r.data?.[0]) {
    fictionSubscribe.cacheKey.value++

    fictionSubscribe.fictionEnv.events.emit('notify', {
      type: 'success',
      message: 'Subscriber saved',
    })

    return r.data[0]
  }
}

export function getViewSubscriberTools(args: { fictionSubscribe: FictionSubscribe, subscriber: vue.Ref<Subscriber> }) {
  const { subscriber, fictionSubscribe } = args

  const avatar = vue.ref({})

  const user = vue.computed(() => {
    const s = subscriber.value
    return deepMerge([s, s.user, s.inlineUser]) as User
  })

  vue.watchEffect(async () => {
    const u = user.value
    avatar.value = u?.avatar ? u?.avatar : (gravatarUrlSync(u.email, { size: 400, default: 'identicon' }))
  })

  const tools = [
    new SettingsTool({
      title: 'Back',
      href: '/subscriber',
      userConfig: { isNavItem: true, navIcon: 'i-tabler-arrow-down-left', navIconAlt: 'i-tabler-arrow-left' },
    }),
    new SettingsTool({
      slug: 'view',
      title: 'View Subscriber',
      userConfig: { isNavItem: true, navIcon: 'i-tabler-user', navIconAlt: 'i-tabler-user' },
      val: subscriber,
      getActions: (args) => {
        const loading = vue.ref(false)
        return vue.computed(() => {
          return [{
            name: 'Save Subscriber',
            onClick: async () => {
              loading.value = true
              const result = await saveSubscriber({ fictionSubscribe, subscriber: subscriber.value })

              if (result) {
                subscriber.value = result
              }

              loading.value = false
            },
            loading: loading.value,
            btn: 'primary',
            iconAfter: 'i-tabler-arrow-up-right',
          }]
        })
      },
      options: (_args) => {
        return vue.computed(() => [
          new InputOption({
            key: 'subscriberHeader',
            input: ElHeader,
            props: {
              heading: user.value.fullName || user.value.email,
              subheading: 'Subscriber',
              avatar: avatar.value,
            },
          }),
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
        ] satisfies InputOption[])
      },
    }),
  ]
  return tools as SettingsTool[]
}
