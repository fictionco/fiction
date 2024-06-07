import { InputOption } from '@fiction/ui'
import { type ActionItem, standardTable as t, vue } from '@fiction/core'
import type { UiElementStyle } from '@fiction/ui/utils'
import type { SettingsTool } from '../types'

const def = vue.defineAsyncComponent

export function newOrgOptions(args: { title: string, actionsRef?: vue.Ref<ActionItem[]> }) {
  return vue.computed(() => {
    const { title, actionsRef } = args

    const actions = actionsRef?.value || []

    const options: InputOption[] = [
      new InputOption({ key: 'orgName', label: 'Organization Name', input: 'InputText', placeholder: 'Organization Name', isRequired: true }),
      new InputOption({ key: 'orgEmail', label: 'Contact and Billing Email', description: 'Used for billing.', input: 'InputEmail', isRequired: true }),
      new InputOption({ key: 'avatar', label: 'Avatar', input: 'InputMediaUpload', subLabel: 'Upload a square image or it will be cropped' }),
    ]

    if (actions.length) {
      options.push(new InputOption({ key: 'actions', input: 'InputActions', props: { actions, defaultSize: 'md' } }))
    }

    return new InputOption({ key: 'orgInfo', label: title, input: 'group', options })
  })
}

export const tools: SettingsTool[] = [
  {
    slug: 'project',
    title: 'Organization',
    userConfig: { isNavItem: true, navIcon: 'i-tabler-cube', navIconAlt: 'i-tabler-cube-plus' },
    options: (args) => {
      const { tool, service } = args
      const userIsAdmin = service.fictionUser.activeUser.value?.isSuperAdmin
      return vue.computed(() => [
        new InputOption({ key: 'orgHead', input: def(() => import('./ElOrgHeader.vue')), uiFormat: 'naked' }),
        newOrgOptions({ title: 'Organization Info' }).value,
        new InputOption({
          key: 'publication',
          label: 'Publication',
          input: 'group',
          options: [
            new InputOption({ key: 'pubName', label: 'Publication Name', description: 'Will be used in emails.', input: 'InputText', placeholder: 'Name of Publication' }),
            new InputOption({ key: 'pubEmail', label: 'Publication Email', subLabel: 'Email will be sent from this address.', input: 'InputEmail' }),
            new InputOption({ key: 'pubEmailFrom', label: 'Sender Name', input: 'InputText', placeholder: 'Sender Name' }),
            new InputOption({ key: 'tagline', label: 'Tagline', input: 'InputText', placeholder: 'Value proposition or niche.' }),
          ],
        }),
        new InputOption({
          key: 'legal',
          label: 'Legal',
          input: 'group',
          options: [
            new InputOption({ key: 'termsUrl', label: 'Terms of Service URL', input: 'InputUrl' }),
            new InputOption({ key: 'privacyUrl', label: 'Privacy Policy URL', input: 'InputUrl' }),
            new InputOption({ key: 'copyrightText', label: 'Copyright Text', input: 'InputText', placeholder: 'Copyright Text' }),
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
      ] satisfies InputOption[],
      )
    },
  },
  {
    slug: 'account',
    title: 'Account Details',
    userConfig: { isNavItem: true, navIcon: 'i-tabler-user', navIconAlt: 'i-tabler-user-plus' },
    options: (args) => {
      return vue.computed(() => [
        new InputOption({ key: 'accountHead', input: def(() => import('./ElAccountHeader.vue')), uiFormat: 'naked' }),
        new InputOption({
          key: 'userDetails',
          label: 'Basic Details',
          input: 'group',
          options: [
            new InputOption({ key: 'fullName', label: 'Full Name', input: 'InputText', placeholder: 'Your Full Name' }),
            new InputOption({ key: 'avatar', label: 'Avatar', input: 'InputMediaUpload', subLabel: 'Upload a square image or it will be cropped' }),
            new InputOption({ key: 'username', label: 'Unique Username', input: 'InputUsername', placeholder: 'my-username', props: { table: 'fiction_user', columns: ['username'] } }),
            new InputOption({ key: 'phone', label: 'Phone Number', description: 'Include country code. Used for 2FA and notifications.', input: 'InputPhone', placeholder: '+1 555 555 5555' }),
          ],
        }),
        new InputOption({
          key: 'userProfile',
          label: 'Profile Details',
          input: 'group',
          options: [
            new InputOption({ key: 'headline', label: 'Profile Headline', input: 'InputText', placeholder: 'CEO @ MyCompany.com' }),
            new InputOption({ key: 'websiteUrl', label: 'Website URL', input: 'InputUrl', placeholder: 'https://www.example.com' }),
            new InputOption({ key: 'xUrl', label: 'X / Twitter URL', input: 'InputUrl', placeholder: 'https://www.x.com/username' }),
            new InputOption({ key: 'instagramUrl', label: 'Instagram URL', input: 'InputUrl', placeholder: 'https://www.instagram.com/username' }),
            new InputOption({ key: 'linkedinUrl', label: 'LinkedIn URL', input: 'InputUrl', placeholder: 'https://www.linkedin.com/in/username' }),
          ],
        }),
      ])
    },
  },
]

// createCard({
//   slug: 'organization',
//   title: 'Projects',
//   el: def(() => import('./el/ViewSettingsOrg.vue')),
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
