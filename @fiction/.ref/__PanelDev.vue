<script lang="ts" setup>
import type { Organization } from '@fiction/core'
import type { Card } from '@fiction/site'
import { useService, vue } from '@fiction/core'
import { AutosaveUtility } from '@fiction/core/utils/save.js'
import { InputOption } from '@fiction/ui/index.js'
import FormEngine from '@fiction/ui/inputs/FormEngine.vue'
import InputApiKey from './InputApiKey.vue'
import SettingsPanel from './SettingsPanel.vue'

type UserConfig = {
  isNavItem: boolean
}

const { card } = defineProps<{ card: Card<UserConfig> }>()
const service = useService()

const loading = vue.ref(true)
const saving = vue.ref('')

const org = vue.computed(() => service.fictionUser.activeOrganization.value)

async function save() {
  saving.value = 'saving'
  const endpoint = service.fictionUser.requests.ManageOrganization
  const fields = org.value
  const orgId = fields?.orgId

  if (!orgId)
    return

  await endpoint.projectRequest({ _action: 'update', fields, where: { orgId } })

  saving.value = ''
}

const saveUtil = new AutosaveUtility({
  onSave: () => save(),
})

function update(orgNew: Organization) {
  service.fictionUser.activeOrganization.value = orgNew
  saveUtil.autosave({ caller: 'panelDev' })
}

const controlOptions = [
  new InputOption({
    label: 'API Authentication',
    subLabel: 'Secure access keys for integrating with our API',
    input: 'InputControl',
    valueDisplay: () => {
      const apiSecret = service.fictionUser?.activeOrganization.value?.apiSecret
      return {
        status: apiSecret ? 'ready' : 'incomplete',
        data: apiSecret ? `${apiSecret.slice(-4).padStart(9, '*')} (Active)` : 'No API key generated',
      }
    },
    options: [
      new InputOption({
        key: 'apiSecret',
        label: 'Secret API Key',
        description: 'Keep this key secure. Do not share or expose it in client-side code.',
        input: InputApiKey,
        props: { card },
      }),
    ],
  }),
]

const options = vue.computed(() => {
  return [
    new InputOption({
      key: 'details',
      label: 'API Configuration',
      input: 'group',
      options: controlOptions,
      format: 'control',
    }),
  ]
})

const header = vue.computed(() => {
  return {
    title: 'Developer Resources',
    subTitle: 'Access API keys, documentation, and integration tools',
    media: {
      class: 'i-tabler-code',
    },
  }
})

vue.onMounted(async () => {
  await service.fictionUser.userInitialized({ caller: 'panelDev' })
  loading.value = false
})
</script>

<template>
  <SettingsPanel
    title="Developer Portal"
    :loading="loading"
    :action="{ buttons: [{
      label: saveUtil.isDirty.value ? 'Saving changes...' : 'All changes saved',
      onClick: () => save(),
      theme: saveUtil.isDirty.value ? 'primary' : 'default',
      loading: saving === 'saving',
      icon: saveUtil.isDirty.value ? 'i-tabler-upload' : 'i-tabler-check',
    }] }"
    :header
  >
    <div v-if="!loading" class="space-y-6">
      <FormEngine
        :model-value="org"
        state-key="settingsTool"
        ui-size="lg"
        :options
        :card="card"
        :disable-group-hide="true"
        :data-value="JSON.stringify(org)"
        @update:model-value="update($event)"
      />
    </div>
  </SettingsPanel>
</template>
