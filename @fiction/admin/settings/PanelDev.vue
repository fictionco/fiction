<script lang="ts" setup>
import type { Card } from '@fiction/site'
import { type Organization, useService, vue } from '@fiction/core'
import { AutosaveUtility } from '@fiction/core/utils/save.js'
import { InputOption } from '@fiction/ui/index.js'
import FormEngine from '@fiction/ui/inputs/FormEngine.vue'
import ElHeader from './ElHeader.vue'
import InputApiKey from './InputApiKey.vue'
import SettingsPanel from './SettingsPanel.vue'

type UserConfig = {
  isNavItem: boolean
}

const { card } = defineProps<{ card: Card<UserConfig> }>()
const service = useService()

const loading = vue.ref(true)
const sending = vue.ref('')

const org = vue.computed(() => service.fictionUser.activeOrganization.value)

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

const controlOptions = [
  new InputOption({
    label: 'API Key',
    subLabel: 'Used for API access',
    input: 'InputControl',
    valueDisplay: () => {
      const apiSecret = service.fictionUser?.activeOrganization.value?.apiSecret
      return {
        status: apiSecret ? 'ready' : 'incomplete',
        // show last four characters, adding askerisks for the rest
        data: apiSecret ? apiSecret.slice(-4).padStart(9, '*') : undefined,
      }
    },
    options: [
      new InputOption({ key: 'apiSecret', label: 'Private API Key', input: InputApiKey }),
    ],
    modalActions: () => [],
  }),

]

const options = vue.computed(() => {
  return [
    new InputOption({
      key: 'details',
      label: 'API Keys',
      input: 'group',
      options: controlOptions,
      format: 'control',
    }),

  ]
})

const header = vue.computed(() => {
  return {
    title: 'Developer Tools',
    subTitle: 'Working with Fiction API',
    media: {
      class: 'i-tabler-code',
    },
  }
})

vue.onMounted(async () => {
  await service.fictionUser.userInitialized()
  loading.value = false
})
</script>

<template>
  <SettingsPanel
    title="Developer and API"
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
