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

const options = vue.computed(() => {
  const userIsAdmin = service.fictionUser.activeUser.value?.isSuperAdmin
  return [
    newOrgOptions(),
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
    title="Subscriber Details"
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
      input-wrap-class="max-w-lg w-full"
      ui-size="lg"
      :options
      :card
      :disable-group-hide="true"
      :data-value="JSON.stringify(org)"
      @update:model-value="update($event)"
    />
  </SettingsPanel>
</template>
