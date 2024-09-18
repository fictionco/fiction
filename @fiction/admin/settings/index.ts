import type { Card } from '@fiction/site'
import { type ActionItem, type StandardServices, vue } from '@fiction/core'

import { InputOption } from '@fiction/ui'
import { SettingsTool } from '../types'
import ElAccountHeader from './ElAccountHeader.vue'
import ElOrgHeader from './ElOrgHeader.vue'

export function newOrgOptions(args: { title: string, actionsRef?: vue.Ref<ActionItem[]> }) {
  return vue.computed<InputOption>(() => {
    const { title, actionsRef } = args

    const actions = actionsRef?.value || []

    const options: InputOption[] = [
      new InputOption({ key: 'orgName', label: 'Publication Name', input: 'InputText', placeholder: 'Publication Name', isRequired: true }),
      new InputOption({ key: 'orgEmail', label: 'Contact Email', description: 'Used for billing.', input: 'InputEmail', isRequired: true }),
      new InputOption({ key: 'avatar', label: 'Publication Avatar', input: 'InputMediaUpload', subLabel: 'Upload a square image or it will be cropped' }),
      new InputOption({ key: 'url', label: 'Primary URL', input: 'InputUrl' }),
    ]

    if (actions.length) {
      options.push(new InputOption({ key: 'actions', input: 'InputActionList', props: { actions, defaultSize: 'md' } }))
    }

    return new InputOption({ key: 'orgInfo', label: title, input: 'group', options })
  })
}

export function getTools(args: { service: StandardServices }) {
  const { service } = args
  const fictionUser = service.fictionUser
  const loading = vue.ref(false)
  const tools = [
    new SettingsTool({
      slug: 'project',
      title: 'Publication',
      userConfig: { isNavItem: true, navIcon: 'i-tabler-cube', navIconAlt: 'i-tabler-cube-plus' },
      val: fictionUser.activeOrganization,

      getActions: (args) => {
        const { tool } = args
        return vue.computed(() => {
          return [{
            testId: 'save',
            name: 'Save Publication',
            onClick: async () => {
              loading.value = true

              const fields = tool.val?.value
              const orgId = fictionUser.activeOrgId.value

              if (!orgId)
                throw new Error('No active organization')

              if (!fields)
                throw new Error('No fields')

              await fictionUser.requests.ManageOrganization.projectRequest({ _action: 'update', fields, where: { orgId } })

              loading.value = false
            },
            loading: loading.value,
            btn: 'primary',
            iconAfter: 'i-tabler-arrow-up-right',
          }]
        })
      },

      options: (args) => {
        const { service, card } = args
        const userIsAdmin = service.fictionUser.activeUser.value?.isSuperAdmin
        return vue.computed(() => [
          new InputOption({ key: 'orgHead', input: ElOrgHeader, uiFormat: 'naked', props: { card } }),
          newOrgOptions({ title: 'Organization Info' }).value,
          new InputOption({
            key: 'publication',
            label: 'Email and Syndication',
            input: 'group',
            options: [
              new InputOption({ key: 'publication.tagline', label: 'Publication Tagline', description: 'Used in descriptions and meta info', input: 'InputText', placeholder: 'A sentence on what you do...' }),
              new InputOption({ key: 'publication.email', label: 'Email: From Email', description: 'Email will be sent from this address.', input: 'InputEmail' }),
              new InputOption({ key: 'publication.sender', label: 'Email: From Name', description: 'If different from publication name', input: 'InputText', placeholder: 'Sender Name' }),
            ],
          }),
          new InputOption({
            key: 'legal',
            label: 'Legal',
            input: 'group',
            options: [
              new InputOption({ key: 'legal.termsUrl', label: 'Terms of Service URL', input: 'InputUrl' }),
              new InputOption({ key: 'legal.privacyUrl', label: 'Privacy Policy URL', input: 'InputUrl' }),
              new InputOption({ key: 'legal.copyrightText', label: 'Copyright Text', input: 'InputText', placeholder: 'Copyright Text' }),
            ],
          }),
          new InputOption({
            key: 'adminOnly',
            label: 'Admin Only',
            input: 'group',
            isHidden: !userIsAdmin,
            options: [
              new InputOption({ key: 'specialPlan', label: 'Assign a Special Pricing Plan', input: 'InputSelect', list: ['standard', 'vip', 'non-profit'] }),
              new InputOption({ key: 'deleteOrg', label: 'Delete Organization', input: 'InputUrl' }),
            ],
          }),
        ] satisfies InputOption[])
      },
    }),
    new SettingsTool({
      slug: 'account',
      title: 'Account Details',
      userConfig: { isNavItem: true, navIcon: 'i-tabler-user', navIconAlt: 'i-tabler-user-plus' },
      val: fictionUser.activeUser,
      getActions: (args) => {
        return vue.computed(() => {
          return [{
            testId: 'save',
            name: 'Save Account',
            onClick: async () => {
              loading.value = true

              const { tool } = args

              const fields = tool.val?.value
              const userId = fictionUser.activeUser.value?.userId

              if (!userId)
                throw new Error('No active user')

              if (!fields)
                throw new Error('No fields')

              await fictionUser.requests.ManageUser.projectRequest({ _action: 'update', fields, where: { userId } })

              loading.value = false
            },
            loading: loading.value,
            btn: 'primary',
            iconAfter: 'i-tabler-arrow-up-right',
          }]
        })
      },
      options: () => {
        return vue.computed(() => [
          new InputOption({ key: 'accountHead', input: ElAccountHeader, uiFormat: 'naked' }),
          new InputOption({
            key: 'userDetails',
            label: 'Basic Details',
            input: 'group',
            options: [
              new InputOption({ key: 'fullName', label: 'Full Name', input: 'InputText', placeholder: 'Your Full Name' }),
              new InputOption({ key: 'avatar', label: 'Avatar', input: 'InputMediaUpload', subLabel: 'Upload a square image or it will be cropped' }),
              new InputOption({ key: 'username', label: 'Unique Username', input: 'InputUsername', placeholder: 'my-username', props: { table: 'fiction_user', columns: [{ name: 'username' }] } }),
              new InputOption({ key: 'phone', label: 'Phone Number', description: 'Include country code. Used for 2FA and notifications.', input: 'InputPhone', placeholder: '+1 555 555 5555' }),
            ],
          }),
          new InputOption({
            key: 'userProfile',
            label: 'Profile Details',
            input: 'group',
            options: [
              new InputOption({ key: 'headline', label: 'Profile Headline', input: 'InputText', placeholder: 'CEO @ MyCompany.com' }),
              new InputOption({ key: 'accounts.websiteUrl', label: 'Website URL', input: 'InputUrl', placeholder: 'https://www.example.com' }),
              new InputOption({ key: 'accounts.xUrl', label: 'X / Twitter URL', input: 'InputUrl', placeholder: 'https://www.x.com/username' }),
              new InputOption({ key: 'accounts.instagramUrl', label: 'Instagram URL', input: 'InputUrl', placeholder: 'https://www.instagram.com/username' }),
              new InputOption({ key: 'accounts.linkedinUrl', label: 'LinkedIn URL', input: 'InputUrl', placeholder: 'https://www.linkedin.com/in/username' }),
            ],
          }),
        ])
      },
    }),
  ] satisfies SettingsTool[]

  return tools
}
// createCard({
//   slug: 'organization',
//   title: 'Projects',
//   el: def(() => import('./el/ViewSettingsvue')),
//   userConfig: { isNavItem: true, navIcon: 'i-tabler-cube', navIconAlt: 'i-tabler-cube-plus' },
// }),
// createCard({
//   slug: 'newOrg',
//   el: def(() => import('./el/ViewNewOrganization.vue')),
//   userConfig: { isNavItem: false, parentItemId: 'organization' },
// }),
// createCard({
//   slug: 'account',
//   el: def(() => import('./el/SettingsAccount.vue')),
//   userConfig: { isNavItem: true, navIcon: 'i-heroicons-user', navIconAlt: 'i-heroicons-user-20-solid' },
// }),
// createCard({
//   slug: 'team',
//   el: def(() => import('./el/ViewTeamIndex.vue')),
//   userConfig: { isNavItem: true, navIcon: 'i-heroicons-user-group', navIconAlt: 'i-heroicons-user-group-20-solid' },
// }),
// createCard({
//   slug: 'teamEdit',
//   el: def(() => import('./el/ViewTeamEdit.vue')),
//   userConfig: { isNavItem: false, parentItemId: 'team', navIcon: 'i-heroicons-user-group', navIconAlt: 'i-heroicons-user-group-20-solid' },
// }),
// createCard({
//   slug: 'teamInvite',
//   el: def(() => import('./el/ViewTeamInvite.vue')),
//   userConfig: { isNavItem: false, parentItemId: 'team', navIcon: 'i-heroicons-user-group', navIconAlt: 'i-heroicons-user-group-20-solid' },
// }),

// createCard({
//   slug: 'billing',
//   el: def(() => import('./el/ViewSettingsBilling.vue')),
//   userConfig: { isNavItem: true, navIcon: 'i-heroicons-credit-card', navIconAlt: 'i-heroicons-credit-card-20-solid' },
// }),
// createCard({
//   slug: 'billingSuccess',
//   el: def(() => import('./el/ViewBillingSuccess.vue')),
//   userConfig: { isNavItem: false, parentItemId: 'billing', navIcon: 'i-heroicons-credit-card', navIconAlt: 'i-heroicons-credit-card-20-solid' },
// }),
// createCard({
//   slug: 'developer',
//   el: def(() => import('./el/ViewSettingsDev.vue')),
//   userConfig: { isNavItem: true, navIcon: 'i-heroicons-code-bracket-square', navIconAlt: 'i-heroicons-code-bracket-square-20-solid' },
// }),
