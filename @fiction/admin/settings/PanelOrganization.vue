<script lang="ts" setup>
import type { ActionButton, Organization } from '@fiction/core'
import type { Card } from '@fiction/site'
import { gravatarUrlSync, useService, vue } from '@fiction/core'
import { OrgSchema as schema } from '@fiction/core/plugin-user/schema'
import { AutosaveUtility } from '@fiction/core/utils/save.js'
import { createOption } from '@fiction/ui/index.js'
import FormEngine from '@fiction/ui/inputs/FormEngine.vue'
import SettingsPanel from './SettingsPanel.vue'

type UserConfig = {
  isNavItem: boolean
}

const { card } = defineProps<{ card: Card<UserConfig> }>()
const service = useService()

const loading = vue.ref(true)
const sending = vue.ref('')

const org = vue.computed(() => service.fictionUser.activeOrganization.value)

const avatarUrl = vue.computed(() => {
  const o = org.value
  return o?.avatar ? o?.avatar : (gravatarUrlSync(o?.orgEmail, { size: 400, default: 'identicon' }))
})

async function save() {
  sending.value = 'saving'
  const endpoint = service.fictionUser.requests.ManageOrganization
  const fields = org.value
  const orgId = fields?.orgId

  if (!orgId)
    return

  await endpoint.projectRequest({ _action: 'update', fields, where: { orgId } })

  sending.value = ''
}

const saveUtil = new AutosaveUtility({
  onSave: () => save(),
})

function update(orgNew: Organization) {
  service.fictionUser.activeOrganization.value = orgNew

  saveUtil.autosave({ caller: 'updateOrg' })
}

const controlOptions = [
  createOption({
    key: 'control.orgName',
    testId: 'orgName',
    label: 'Organization Name',
    subLabel: 'Used for publication name.',
    input: 'InputControl',
    valueDisplay: () => {
      return {
        status: org.value?.orgName ? 'ready' : 'incomplete',
        data: org.value?.orgName,
      }
    },
    options: [
      createOption({ schema, key: 'orgName', label: 'Publication Name', input: 'InputText', placeholder: 'Publication Name', isRequired: true }),
    ],
  }),
  createOption({
    key: 'control.orgEmail',
    testId: 'orgEmail',
    label: 'Primary Email',
    subLabel: 'Used for newsletter, billing, admin.',
    input: 'InputControl',
    valueDisplay: () => {
      return {
        status: org.value?.orgEmail ? 'ready' : 'incomplete',
        data: org.value?.orgEmail,
      }
    },
    options: [
      createOption({ schema, key: 'orgEmail', label: 'Contact Email', description: 'Used for billing.', input: 'InputEmail', isRequired: true }),
    ],
  }),
  createOption({
    key: 'control.orgAvatar',
    testId: 'orgAvatar',
    label: 'Logo / Avatar',
    subLabel: 'Will default to Gravatar if not set.',
    input: 'InputControl',
    valueDisplay: () => {
      return {
        status: org.value?.avatar?.url ? 'ready' : 'incomplete',
        data: org.value?.avatar,
        format: 'media',
      }
    },
    options: [
      createOption({ schema, key: 'avatar', label: 'Publication Avatar', input: 'InputMedia', subLabel: 'Upload a square image or it will be cropped' }),
    ],
  }),
  createOption({
    key: 'control.orgUrl',
    testId: 'orgUrl',
    label: 'Primary Website',
    input: 'InputControl',
    valueDisplay: () => {
      return {
        status: org.value?.websiteUrl ? 'ready' : 'incomplete',
        data: org.value?.websiteUrl,
      }
    },
    options: [
      createOption({ schema, key: 'websiteUrl', label: 'Website', input: 'InputUrl', isRequired: true }),
    ],
  }),
]

const newsletterOptions = [
  createOption({
    key: 'control.pubTitle',
    testId: 'pubTitle',
    label: 'Sending Title',
    subLabel: 'The title of your newsletter or publication',
    input: 'InputControl',
    valueDisplay: () => {
      return {
        status: org.value?.sender?.title ? 'ready' : 'incomplete',
        data: org.value?.sender?.title,
      }
    },
    options: [
      createOption({ schema, key: 'sender.title', label: 'Newsletter Title', input: 'InputText' }),
    ],
  }),
  createOption({
    key: 'control.pubTagline',
    testId: 'pubTagline',
    label: 'Publication Tagline',
    subLabel: 'Description of your publication.',
    input: 'InputControl',
    valueDisplay: () => {
      return {
        status: org.value?.sender?.tagline ? 'ready' : 'optional',
        data: org.value?.sender?.tagline,
      }
    },
    options: [
      createOption({ schema, key: 'sender.tagline', label: 'Publication Tagline', description: 'Used in descriptions and meta info', input: 'InputText', placeholder: 'A sentence on what you do...' }),
    ],
  }),
  createOption({
    key: 'control.fromEmail',
    testId: 'pubEmail',
    label: 'Email "Sent From" Email',
    subLabel: 'Email will be sent from this address.',
    input: 'InputControl',
    valueDisplay: () => {
      const { fromEmail } = org.value?.sender || {}
      return {
        status: fromEmail ? 'ready' : 'incomplete',
        data: fromEmail,
      }
    },
    options: [
      createOption({ schema, key: 'sender.fromEmail', label: 'From Email / Sender', description: 'Email will be sent from this address.', input: 'InputEmail' }),
    ],
  }),
  createOption({
    key: 'control.fromName',
    testId: 'pubEmail',
    label: 'Email "Sent From" Name',
    subLabel: 'Email will be sent with this name.',
    input: 'InputControl',
    valueDisplay: () => {
      const { fromName } = org.value?.sender || {}
      return {
        status: fromName ? 'ready' : 'incomplete',
        data: fromName,
      }
    },
    options: [
      createOption({ schema, key: 'sender.fromName', label: 'From Name', input: 'InputText', placeholder: 'Email "From" Name' }),
    ],
  }),

]

const legalOptions = [
  createOption({
    key: 'control.terms',
    testId: 'legal',
    label: 'Terms of Service URL',
    input: 'InputControl',
    valueDisplay: () => {
      const { termsUrl } = org.value?.legal || {}
      const out = []
      if (termsUrl)
        out.push('Terms of Service Added')

      return {
        status: termsUrl ? 'ready' : 'incomplete',
        data: out.join(', '),
      }
    },
    options: [
      createOption({ schema, key: 'legal.termsUrl', label: 'Terms of Service URL', input: 'InputUrl' }),
    ],
  }),
  createOption({
    key: 'control.privacy',
    testId: 'legal',
    label: 'Privacy Policy URL',
    input: 'InputControl',
    valueDisplay: () => {
      const { privacyUrl } = org.value?.legal || {}
      const out = []
      if (privacyUrl)
        out.push('Privacy Policy Added')
      return {
        status: privacyUrl ? 'ready' : 'incomplete',
        data: out.join(', '),
      }
    },
    options: [
      createOption({ schema, key: 'legal.privacyUrl', label: 'Privacy Policy URL', input: 'InputUrl' }),
    ],
  }),
  createOption({
    key: 'control.address',
    testId: 'streetAddress',
    label: 'Business Street Address',
    subLabel: 'Used in emails and other places.',
    input: 'InputControl',
    valueDisplay: () => {
      const { streetAddress } = org.value || {}
      return {
        status: streetAddress ? 'ready' : 'incomplete',
        data: streetAddress,
      }
    },
    options: [
      createOption({
        schema,
        key: 'streetAddress',
        label: 'Street Address',
        input: 'InputUrl',
        placeholder: '123 Main St, City, State, Zip',
      }),
    ],
  }),
]

const adminOptions = [
  createOption({
    key: 'control.specialPlan',
    testId: 'specialPlan',
    label: 'Add a Special Pricing Plan',
    subLabel: 'Discounts or special pricing for certain organizations.',
    input: 'InputControl',
    valueDisplay: () => {
      const { specialPlan } = org.value || {}
      return {
        status: specialPlan ? 'enabled' : 'optional',
        data: specialPlan,
      }
    },
    options: [
      createOption({ schema, key: 'specialPlan', label: 'Assign a Special Pricing Plan', input: 'InputSelect', list: ['standard', 'vip', 'non-profit'] }),
    ],
  }),
  createOption({
    key: 'control.delete',
    testId: 'deleteOrg',
    label: 'Delete Organization',
    subLabel: 'Permanently delete this organization.',
    input: 'InputControl',
    actions: () => [
      {
        testId: 'deleteOrgButton',
        label: 'Delete Organization...',
        theme: 'rose',
        design: 'ghost',
        icon: 'i-tabler-trash',
        loading: loading.value,
        onClick: async () => {
          const endpoint = service.fictionUser.requests.ManageOrganization

          const confirmed = confirm('Are you sure you want to delete this organization?')
          if (confirmed && org.value?.orgId) {
            sending.value = 'delete'
            const r = await endpoint.projectRequest({ _action: 'delete', where: { orgId: org.value?.orgId } })
            if (r.status === 'success') {
              await card.goto('/', { caller: 'adminDeleteOrganization' })
            }

            sending.value = ''
          }
        },
      } satisfies ActionButton,
    ],
  }),
]

const options = vue.computed(() => {
  return [
    createOption({
      key: 'details',
      label: 'Organization Details',
      input: 'group',
      options: controlOptions,
      format: 'control',
    }),
    createOption({
      key: 'publication',
      label: 'Sending Email and Publication',
      input: 'group',
      options: newsletterOptions,
      format: 'control',
    }),
    createOption({
      key: 'legal',
      label: 'Legal',
      input: 'group',
      options: legalOptions,
      format: 'control',
    }),
    createOption({
      key: 'adminOnly',
      label: 'Admin Only Options',
      subLabel: 'Only Fiction Admins should see these options.',
      input: 'group',
      format: 'control',
      isHidden: !service.fictionUser.activeUser.value?.isSuperAdmin,
      options: adminOptions,
    }),
  ]
})

const header = vue.computed(() => {
  return {
    title: org.value?.orgName,
    subTitle: `Organization Details - id:${org.value?.orgId}`,
    media: avatarUrl.value,
  }
})

vue.onMounted(async () => {
  await service.fictionUser.userInitialized({ caller: 'PanelOrganization' })
  loading.value = false
})
</script>

<template>
  <SettingsPanel
    title="Organization Details"
    :loading
    :action="{ buttons: [{
      testId: 'saveButton',
      label: saveUtil.isDirty.value ? 'Saving...' : 'Saved',
      onClick: () => save(),
      theme: saveUtil.isDirty.value ? 'primary' : 'default',
      loading: sending === 'saving',
      icon: saveUtil.isDirty.value ? 'i-tabler-upload' : 'i-tabler-check',
    }] }"
    :header
  >
    <FormEngine
      :model-value="org"
      state-key="settingsTool"
      ui-size="lg"
      :options
      :card
      :disable-group-hide="true"
      @update:model-value="update($event)"
    />
  </SettingsPanel>
</template>
