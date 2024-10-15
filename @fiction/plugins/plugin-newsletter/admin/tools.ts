import type { EditorTool } from '@fiction/admin'
import type { Card } from '@fiction/site'
import type { FictionSend } from '..'
import type { EmailCampaign } from '../campaign'
import { AdminEditorController } from '@fiction/admin'
import { type ActionButton, vue } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import InputAudience from './InputAudience.vue'

export const tools = [
  {
    toolId: 'emailPreview',
    title: 'Email Preview',
    icon: 'i-tabler-eye',
    location: 'primary',
    isPrimary: true,
    widthClasses: 'w-[400px] lg:w-[700px]',
    el: vue.defineAsyncComponent(async () => import('./SidebarEmailPreview.vue')),
  },
  {
    toolId: 'emailTest',
    title: 'Send Test Emails',
    icon: 'i-tabler-mailbox',
    location: 'primary',
    isPrimary: true,
    el: vue.defineAsyncComponent(async () => import('./SidebarEmailPreview.vue')),
  },
  {
    toolId: 'emailSettings',
    title: 'Compose Email',
    icon: 'i-tabler-mail',
    location: 'context',
    isDefault: true,
    el: vue.defineAsyncComponent(async () => import('./SidebarEmailEditor.vue')),
    props: () => {
      return vue.computed(() => ({}))
    },
  },
] as const satisfies EditorTool<any, { card: Card, campaign: EmailCampaign }>[]

export type ToolKeys = (typeof tools)[number]['toolId']

export const emailComposeController = new AdminEditorController({ tools })

export function getEmailManageOptions(args: {
  fictionSend: FictionSend
  campaign?: EmailCampaign
  card: Card
}): InputOption[] {
  const { campaign, card } = args
  return [
    new InputOption({ key: 'title', label: 'Internal Title', input: 'InputText', isRequired: true, placeholder: 'Only used to help you manage this campaign.' }),
    new InputOption({
      key: 'emailSettings',
      label: 'Email Settings',
      input: 'group',
      options: [
        new InputOption({ key: 'subject', label: 'Subject Line', input: 'InputText', isRequired: true, placeholder: 'Subject Line', description: 'This is the subject line that appears in the recipient\'s inbox.' }),
        new InputOption({ key: 'preview', label: 'Preview Text', input: 'InputText', placeholder: 'Preview Text', description: 'This is the text that appears in the inbox preview of your email.' }),
      ],
    }),
    new InputOption({
      key: 'scheduleSettings',
      label: 'Schedule Settings',
      input: 'group',
      options: [

        new InputOption({
          key: 'scheduleMode',
          label: 'Sending Time',
          input: 'InputSelectCustom',
          isRequired: true,
          list: [
            { name: 'Send Immediately', value: 'now' },
            { name: 'Schedule Send', value: 'schedule' },
          ],
        }),
        new InputOption({
          key: 'scheduledAt',
          label: 'Scheduled Send Time',
          input: 'InputDate',
          isRequired: true,
          isHidden: campaign?.scheduleMode.value !== 'schedule',
          props: { includeTime: true, dateMode: 'future' },
        }),
        new InputOption({ key: 'audience', label: 'Audience', input: InputAudience, props: { card } }),
      ],
    }),

    new InputOption({
      key: 'emailContent',
      label: 'Email Content',
      input: 'group',
      options: [

        new InputOption({ key: 'post.title', label: 'Title', input: 'InputText', placeholder: 'Add a Catchy Title', isRequired: true, description: 'The text header that appears at the top of the email.' }),
        new InputOption({ key: 'post.subTitle', label: 'Subtitle', input: 'InputText', placeholder: 'Add some context with a subtitle', description: 'The text that appears below the title.' }),
        new InputOption({ key: 'actions', label: 'Email Body Content', input: 'InputActionList', props: {
          actions: [{ name: 'Edit Email Content', btn: 'primary', href: card.link(`/campaign-edit?campaignId=${campaign?.campaignId}`) }],
          uiSize: 'md',
        } }),
      ],
    }),
    new InputOption({
      key: 'dangerZone',
      label: 'Danger Zone',
      input: 'group',
      options: [
        new InputOption({
          key: 'deletePost',
          label: 'Permanently Delete Email',
          input: 'InputActionList',
          props: {
            actions: [
              {
                name: 'Delete Email...',
                theme: 'default',
                onClick: async () => {
                  const confirmed = confirm('Are you sure you want to delete this email?')

                  if (confirmed) {
                    await campaign?.delete()
                    await card.goto('/send')
                  }
                },
              },
            ] as ActionButton[],
          },
        }),

      ],
    }),
  ]
}

// export function getTools(args: { fictionSend: FictionSend, card: Card }) {
//   const { fictionSend, card } = args
//   const fictionRouter = fictionSend.settings.fictionRouter
//   const loading = vue.ref(false)
//   const email = vue.shallowRef<EmailCampaign>()

//   vue.watch(() => fictionRouter.query.value.campaignId, async (v, old) => {
//     if (!v || v === old)
//       return

//     email.value = await loadEmail({ fictionSend, campaignId: v as string })
//   }, { immediate: true })

//   const val = vue.computed<EmailCampaignConfig | undefined>({
//     get: () => email.value?.toConfig(),
//     set: v => (email.value?.update(v || {})),
//   })

//   const editEmailAction = (theme: 'default' | 'primary' = 'default') => ({
//     name: 'Compose',
//     href: card.link(`/campaign-edit?campaignId=${email.value?.campaignId}`),
//     theme,
//     icon: 'i-tabler-edit',
//   })

//   const pubAction = (btn: 'default' | 'primary' = 'default') => ({
//     name: 'Publication Setup',
//     href: card.link(`/settings/project`),
//     btn,
//     icon: 'i-tabler-news',
//   })

//   const saveAction = (btn: 'default' | 'primary' = 'default') => {
//     return {
//       name: 'Save',
//       onClick: async () => {
//         loading.value = true
//         const fields = val.value
//         if (!fields)
//           throw new Error('No fields')

//         const campaignId = fields?.campaignId

//         await manageEmailCampaign({ fictionSend, params: { _action: 'update', where: [{ campaignId }], fields }, options: { minTime: 1000 } })

//         loading.value = false
//       },
//       loading: loading.value,
//       btn,
//       icon: 'i-tabler-upload',
//     }
//   }

//   const tools = [
//     new SettingsTool({
//       slug: 'overview',
//       title: 'Overview',
//       userConfig: { isNavItem: true, navIcon: 'i-tabler-mail', navIconAlt: 'i-tabler-mail' },
//       val,
//       getActions: () => vue.computed(() => [pubAction()]),
//       options: (_args) => {
//         return vue.computed(() => {
//           return [new InputOption({ key: '*', input: InputOverview, props: { actions: [editEmailAction()] } })]
//         })
//       },
//     }),
//     new SettingsTool({
//       slug: 'settings',
//       title: 'Settings',
//       userConfig: { isNavItem: true, navIcon: 'i-tabler-settings', navIconAlt: 'i-tabler-settings-filled' },
//       val,
//       getActions: () => vue.computed(() => [editEmailAction(), saveAction()]),
//       options: (_args) => {
//         return vue.computed(() => getEmailManageOptions({ fictionSend, campaign: email.value, card }))
//       },
//     }),
//     new SettingsTool({
//       slug: 'preview',
//       title: vue.computed(() => `Preview`),
//       userConfig: { isNavItem: true, navIcon: 'i-tabler-eye', navIconAlt: 'i-tabler-eye' },
//       val,
//       getActions: () => vue.computed(() => [pubAction(), editEmailAction()]),
//       options: (_args) => {
//         return vue.computed(() => {
//           return [new InputOption({ key: '*', label: 'Email Preview', input: InputEmailPreview })]
//         })
//       },
//     }),
//   ]

//   return { tools: tools as SettingsTool[], val }
// }
