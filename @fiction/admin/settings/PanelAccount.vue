<script lang="ts" setup>
import type { Card } from '@fiction/site'
import { gravatarUrlSync, type User, useService, vue } from '@fiction/core'
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

const user = vue.computed(() => service.fictionUser.activeUser.value)

const avatarUrl = vue.computed(() => {
  const o = user.value
  return o?.avatar ? o?.avatar : (gravatarUrlSync(o?.email, { size: 400, default: 'identicon' }))
})

async function save() {
  sending.value = 'saving'
  const endpoint = service.fictionUser.requests.ManageUser
  const fields = user.value
  const userId = fields?.userId

  if (!userId)
    return

  await endpoint.projectRequest({ _action: 'update', fields, where: { userId } })

  sending.value = ''
}

const saveUtil = new AutosaveUtility({
  onSave: () => save(),
})

function update(userNew: User) {
  service.fictionUser.activeUser.value = userNew

  saveUtil.autosave()
}

const options = vue.computed(() => {
  const userIsAdmin = service.fictionUser.activeUser.value?.isSuperAdmin
  return [
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
  ]
})

const header = vue.computed(() => {
  return {
    title: user.value?.fullName || user.value?.email,
    subTitle: 'Accounts Details',
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
      :model-value="user"
      state-key="settingsTool"
      input-wrap-class="max-w-lg w-full"
      ui-size="lg"
      :options
      :card
      :disable-group-hide="true"
      :data-value="JSON.stringify(user)"
      @update:model-value="update($event)"
    />
  </SettingsPanel>
</template>
