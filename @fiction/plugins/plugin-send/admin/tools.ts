import { InputOption } from '@fiction/ui'
import { type ActionItem, vue } from '@fiction/core'
import { SettingsTool } from '@fiction/admin/types'
import InputAuthors from '@fiction/posts/el/InputAuthors.vue'
import type { EditorTool } from '@fiction/admin'
import { AdminEditorController } from '@fiction/admin'
import type { Card } from '@fiction/site'
import type { FictionSend } from '..'
import type { Email } from '../email'
import type { EmailSendConfig } from '../schema'
import { loadEmail } from '../utils'
import { manageEmailSend } from '../utils.js'
import InputAudience from './InputAudience.vue'
import InputEmailPreview from './InputEmailPreview.vue'
import InputOverview from './InputOverview.vue'

export const tools = [
  {
    toolId: 'emailPreview',
    title: 'Email Preview',
    icon: 'i-tabler-eye',
    location: 'primary',
    isPrimary: true,
    el: vue.defineAsyncComponent(() => import('./SidebarEmailPreview.vue')),
    widthClasses: 'w-[400px] lg:w-[700px]',
  },
  {
    toolId: 'emailSettings',
    title: 'Compose Email',
    icon: 'i-tabler-mail',
    location: 'context',
    isDefault: true,
    props: () => {
      return vue.computed(() => ({}))
    },
    el: vue.defineAsyncComponent(() => import('./SidebarEmailEditor.vue')),
  },
] as const satisfies EditorTool[]

export type ToolKeys = (typeof tools)[number]['toolId']

export const emailComposeController = new AdminEditorController({ tools })

export function getEmailManageOptions(args: { fictionSend: FictionSend, email?: Email, card: Card }) {
  const { email, card } = args
  return [
    new InputOption({ key: 'title', label: 'Internal Title', input: 'InputText', isRequired: true }),
    new InputOption({ key: 'actions', label: 'Edit', input: 'InputActions', props: {
      actions: [{ name: 'Edit Email', btn: 'primary', href: card.link(`/email-edit?emailId=${email?.emailId}`) }],
    } }),
    new InputOption({
      key: 'emailSettings',
      label: 'Email Settings',
      input: 'group',
      options: [
        new InputOption({ key: 'subject', label: 'Subject Line', input: 'InputText', isRequired: true }),
        new InputOption({ key: 'preview', label: 'Preview Text', input: 'InputText' }),
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
          isHidden: email?.scheduleMode.value !== 'schedule',
          props: { includeTime: true, dateMode: 'future' },
        }),
        new InputOption({
          key: 'audience',
          label: 'Audience',
          input: InputAudience,
        }),
      ],
    }),

    new InputOption({
      key: 'emailContent',
      label: 'Email Content',
      input: 'group',
      options: [

        new InputOption({
          key: 'post.title',
          label: 'Title',
          input: 'InputText',
          placeholder: 'Title',
          isRequired: true,
        }),
        new InputOption({
          key: 'post.subTitle',
          label: 'Subtitle',
          input: 'InputText',
        }),
        new InputOption({ key: 'post.authors', label: 'Authors', input: InputAuthors, props: { } }),
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
          input: 'InputActions',
          props: {
            actions: [
              {
                name: 'Delete Email...',
                btn: 'default',
                onClick: async () => {
                  const confirmed = confirm('Are you sure you want to delete this email?')

                  if (confirmed) {
                    await email?.delete()
                    await card.goto('/send')
                  }
                },
              },
            ] as ActionItem[],
          },
        }),

      ],
    }),
  ]
}

export function getTools(args: { fictionSend: FictionSend, card: Card }) {
  const { fictionSend, card } = args
  const fictionRouter = fictionSend.settings.fictionRouter
  const loading = vue.ref(false)
  const email = vue.shallowRef<Email>()

  vue.watch(() => fictionRouter.query.value.emailId, async (v, old) => {
    if (v === old)
      return

    email.value = await loadEmail({ fictionSend })
  }, { immediate: true })

  const val = vue.computed<EmailSendConfig | undefined>({
    get: () => {
      return email.value?.toConfig()
    },
    set: (v) => {
      email.value?.update(v || {})
    },
  })

  const editEmailAction = () => ({
    name: 'Compose Email',
    href: card.link(`/email-edit?emailId=${email.value?.emailId}`),
    btn: 'default' as const,
    icon: 'i-tabler-edit',
  })

  const pubAction = () => ({
    name: 'Edit Publication',
    href: card.link(`/settings/project`),
    btn: 'default' as const,
    icon: 'i-tabler-news',
  })

  const saveAction = () => {
    return {
      name: 'Save',
      onClick: async () => {
        loading.value = true
        const fields = val.value
        if (!fields)
          throw new Error('No fields')

        const emailId = fields?.emailId

        await manageEmailSend({ fictionSend, params: { _action: 'update', where: [{ emailId }], fields }, options: { minTime: 1000 } })

        loading.value = false
      },
      loading: loading.value,
      btn: 'primary' as const,
      icon: 'i-tabler-upload',
    }
  }

  const tools = [
    new SettingsTool({
      slug: 'overview',
      title: 'Overview',
      userConfig: { isNavItem: true, navIcon: 'i-tabler-mail', navIconAlt: 'i-tabler-mail' },
      val,
      getActions: () => vue.computed(() => [pubAction()]),
      options: (_args) => {
        return vue.computed(() => {
          return [new InputOption({ key: '*', input: InputOverview, props: { actions: [editEmailAction()] } })]
        })
      },
    }),
    new SettingsTool({
      slug: 'settings',
      title: 'Settings',
      userConfig: { isNavItem: true, navIcon: 'i-tabler-settings', navIconAlt: 'i-tabler-settings-filled' },
      val,
      getActions: () => vue.computed(() => [editEmailAction(), saveAction()]),
      options: (_args) => {
        return vue.computed(() => getEmailManageOptions({ fictionSend, email: email.value, card }))
      },
    }),
    new SettingsTool({
      slug: 'preview',
      title: vue.computed(() => `Preview`),
      userConfig: { isNavItem: true, navIcon: 'i-tabler-eye', navIconAlt: 'i-tabler-eye' },
      val,
      getActions: () => vue.computed(() => [pubAction(), editEmailAction()]),
      options: (_args) => {
        return vue.computed(() => {
          return [new InputOption({ key: '*', label: 'Email Preview', input: InputEmailPreview })]
        })
      },
    }),
  ]

  return { tools: tools as SettingsTool[], val }
}
