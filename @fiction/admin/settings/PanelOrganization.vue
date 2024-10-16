<script lang="ts" setup>
import type { Card } from '@fiction/site'
import { gravatarUrlSync, type Organization, useService, vue } from '@fiction/core'
import { AutosaveUtility } from '@fiction/core/utils/save.js'
import { InputOption } from '@fiction/ui/index.js'
import FormEngine from '@fiction/ui/inputs/FormEngine.vue'
import ElHeader from './ElHeader.vue'
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

  saveUtil.autosave()
}

function newOrgOptions() {
  const options: InputOption[] = [
    new InputOption({ key: 'orgName', label: 'Publication Name', input: 'InputText', placeholder: 'Publication Name', isRequired: true }),
    new InputOption({ key: 'orgEmail', label: 'Contact Email', description: 'Used for billing.', input: 'InputEmail', isRequired: true }),
    new InputOption({ key: 'avatar', label: 'Publication Avatar', input: 'InputMediaUpload', subLabel: 'Upload a square image or it will be cropped' }),
    new InputOption({ key: 'url', label: 'Website', input: 'InputUrl' }),
  ]

  return new InputOption({ key: 'orgInfo', label: 'Details', input: 'group', options })
}

const controlOptions = [
  new InputOption({
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
      new InputOption({ key: 'orgName', label: 'Publication Name', input: 'InputText', placeholder: 'Publication Name', isRequired: true }),
    ],
  }),
  new InputOption({
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
      new InputOption({ key: 'orgEmail', label: 'Contact Email', description: 'Used for billing.', input: 'InputEmail', isRequired: true }),
    ],
  }),
  new InputOption({
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
      new InputOption({ key: 'avatar', label: 'Publication Avatar', input: 'InputMedia', subLabel: 'Upload a square image or it will be cropped' }),
    ],
  }),
  new InputOption({
    label: 'Primary Website',
    input: 'InputControl',
    valueDisplay: () => {
      return {
        status: org.value?.url ? 'ready' : 'incomplete',
        data: org.value?.url,
      }
    },
    options: [
      new InputOption({ key: 'url', label: 'Website', input: 'InputUrl' }),
    ],
  }),
]

const newsletterOptions = [
  new InputOption({
    label: 'Newsletter Title',
    subLabel: 'Used in emails and other places.',
    input: 'InputControl',
    valueDisplay: () => {
      return {
        status: org.value?.publication?.title ? 'ready' : 'incomplete',
        data: org.value?.publication?.title,
      }
    },
    options: [
      new InputOption({ key: 'publication.title', label: 'Newsletter Title', input: 'InputText' }),
    ],
  }),
  new InputOption({
    label: 'Newsletter Tagline / Description',
    input: 'InputControl',
    valueDisplay: () => {
      return {
        status: org.value?.publication?.tagline ? 'ready' : 'optional',
        data: org.value?.publication?.tagline,
      }
    },
    options: [
      new InputOption({ key: 'publication.tagline', label: 'Newsletter Tagline', description: 'Used in descriptions and meta info', input: 'InputText', placeholder: 'A sentence on what you do...' }),
    ],
  }),
  new InputOption({
    label: 'Newsletter Email',
    subLabel: 'Email will be sent from this address.',
    input: 'InputControl',
    valueDisplay: () => {
      const { email, sender } = org.value?.publication || {}
      return {
        status: email ? 'ready' : 'incomplete',
        data: sender ? `${sender} <${email}>` : email,
      }
    },
    options: [
      new InputOption({ key: 'publication.email', label: 'Sender Email', description: 'Email will be sent from this address.', input: 'InputEmail' }),
      new InputOption({ key: 'publication.sender', label: 'Sender Name', input: 'InputText', placeholder: 'Sender Name' }),
    ],
  }),
]

const legalOptions = [
  new InputOption({
    label: 'Terms of Service and Privacy Policy',
    subLabel: 'Needed for sites, newsletters, and other services.',
    input: 'InputControl',
    valueDisplay: () => {
      const { termsUrl, privacyUrl } = org.value?.legal || {}
      const out = []
      if (termsUrl)
        out.push('Terms of Service Added')
      if (privacyUrl)
        out.push('Privacy Policy Added')
      return {
        status: termsUrl && privacyUrl ? 'ready' : 'incomplete',
        data: out.join(', '),
      }
    },
    options: [
      new InputOption({ key: 'legal.termsUrl', label: 'Terms of Service URL', input: 'InputUrl' }),
      new InputOption({ key: 'legal.privacyUrl', label: 'Privacy Policy URL', input: 'InputUrl' }),
    ],
  }),
]

const adminOptions = [
  new InputOption({
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
      new InputOption({ key: 'specialPlan', label: 'Assign a Special Pricing Plan', input: 'InputSelect', list: ['standard', 'vip', 'non-profit'] }),
    ],
  }),
  new InputOption({
    label: 'Delete Organization',
    subLabel: 'Permanently delete this organization.',
    input: 'InputControl',
    actions: () => [
      {
        name: 'Delete Organization...',
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
      },
    ],
  }),
]

const options = vue.computed(() => {
  return [
    new InputOption({
      key: 'details',
      label: 'Organization Details',
      input: 'group',
      options: controlOptions,
      format: 'control',
    }),
    new InputOption({
      key: 'publication',
      label: 'Newsletter and Email',
      input: 'group',
      options: newsletterOptions,
      format: 'control',
    }),
    new InputOption({
      key: 'legal',
      label: 'Legal',
      input: 'group',
      options: legalOptions,
      format: 'control',
    }),
    new InputOption({
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
    subTitle: 'Organization Details',
    media: avatarUrl.value,
  }
})

vue.onMounted(async () => {
  await service.fictionUser.userInitialized()
  loading.value = false
})
</script>

<template>
  <SettingsPanel
    title="Organization Details"
    :loading
    :actions="[{
      name: saveUtil.isDirty.value ? 'Saving...' : 'Saved',
      onClick: () => save(),
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
      :model-value="org"
      state-key="settingsTool"
      ui-size="lg"
      :options
      :card
      :disable-group-hide="true"
      :data-value="JSON.stringify(org)"
      @update:model-value="update($event)"
    />
  </SettingsPanel>
</template>
