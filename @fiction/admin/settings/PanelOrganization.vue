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
  return o?.avatar ? o?.avatar : (gravatarUrlSync(o?.orgEmail, { size: 400 }))
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
    label: 'Brand Name',
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
    label: 'Icon',
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
    key: 'control.senderEmail',
    testId: 'senderEmail',
    label: `Reply To Email`,
    subLabel: 'ReplyTo email for email campaigns and newsletters.',
    input: 'InputControl',
    valueDisplay: () => {
      const { senderEmail } = org.value || {}
      return {
        status: senderEmail ? 'ready' : 'incomplete',
        data: senderEmail,
      }
    },
    options: [
      createOption({ schema, key: 'senderEmail', label: 'From Email / ReplyTo', description: 'Email will be sent from this address.', input: 'InputEmail' }),
    ],
  }),
  createOption({
    key: 'control.senderName',
    testId: 'senderName',
    label: 'Sender Name',
    subLabel: 'Email will be sent with this name.',
    input: 'InputControl',
    valueDisplay: () => {
      const { senderName } = org.value || {}
      return {
        status: senderName ? 'ready' : 'incomplete',
        data: senderName,
      }
    },
    options: [
      createOption({
        schema,
        key: 'senderName',
        label: 'From Name',
        input: 'InputText',
        placeholder: 'Enter Name',
      }),
    ],
  }),
  createOption({
    key: 'control.description',
    testId: 'description',
    label: 'Headline / Tagline',
    subLabel: 'A catchy tagline explaining what you do.',
    input: 'InputControl',
    valueDisplay: () => {
      return {
        status: org.value?.description ? 'ready' : 'optional',
        data: org.value?.description,
      }
    },
    options: [
      createOption({
        schema,
        key: 'description',
        label: 'Headline / Tagline',
        description: 'Used in descriptions and meta info',
        input: 'InputText',
        placeholder: 'A sentence on what you do...',
      }),
    ],
  }),
]

const legalOptions = [

  createOption({
    key: 'control.address',
    testId: 'streetAddress',
    label: 'Business Street Address',
    subLabel: 'Used in emails and other places.',
    input: 'InputControl',
    valueDisplay: () => {
      const { streetAddress } = org.value || {}
      return {
        status: streetAddress ? 'ready' : 'optional',
        data: streetAddress,
      }
    },
    options: [
      createOption({
        schema,
        key: 'streetAddress',
        label: 'Street Address',
        input: 'InputText',
        placeholder: '123 Main St, City, State, Zip',
        props: {
          autocomplete: 'street-address',
        },
      }),
    ],
  }),
  createOption({
    key: 'control.companyName',
    testId: 'companyName',
    label: 'Company Name',
    subLabel: 'For copyright and legal.',
    input: 'InputControl',
    valueDisplay: () => {
      const { companyName } = org.value || {}
      return {
        status: companyName ? 'ready' : 'optional',
        data: companyName,
      }
    },
    options: [
      createOption({
        schema,
        key: 'companyName',
        label: 'Street Address',
        input: 'InputText',
        placeholder: 'Acme, Inc.',
        props: {
          autocomplete: 'organization',
        },
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
    label: 'Delete Brand Workspace',
    subLabel: 'Permanently delete this brand.',
    input: 'InputControl',
    icon: { class: 'i-tabler-trash' },
    actions: () => [
      {
        testId: 'deleteOrgButton',
        label: 'Delete Brand Workspace...',
        theme: 'rose',
        design: 'ghost',
        icon: 'i-tabler-trash',
        loading: loading.value,
        onClick: async () => {
          const endpoint = service.fictionUser.requests.ManageOrganization

          const confirmed = confirm('Are you sure you want to delete this brand?')
          if (confirmed && org.value?.orgId) {
            sending.value = 'delete'
            const r = await endpoint.projectRequest({ _action: 'delete', where: { orgId: org.value?.orgId } })
            if (r.status === 'success') {
              await card.goto('/', { caller: 'adminDeleteBrand' })
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
      label: 'Details',
      input: 'group',
      options: controlOptions,
      format: 'control',
      icon: { class: 'i-tabler-building-plus' },
    }),
    createOption({
      key: 'publication',
      label: 'Publication',
      input: 'group',
      options: [...newsletterOptions, ...legalOptions],
      format: 'control',
      icon: { class: 'i-tabler-speakerphone' },
    }),
    createOption({
      key: 'adminOnly',
      label: 'Admin Only Options',
      subLabel: 'Only Fiction Admins should see these options.',
      input: 'group',
      format: 'control',
      isHidden: !service.fictionUser.activeUser.value?.isSuperAdmin,
      options: adminOptions,
      icon: { class: 'i-tabler-shield-lock' },
    }),
  ]
})

const header = vue.computed(() => {
  return {
    title: org.value?.orgName,
    subTitle: `Brand Details - id:${org.value?.orgId}`,
    media: avatarUrl.value,
  }
})

vue.onMounted(async () => {
  await service.fictionUser.userInitialized({ caller: 'PanelBrand' })
  loading.value = false
})
</script>

<template>
  <SettingsPanel
    title="Brand Details"
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
