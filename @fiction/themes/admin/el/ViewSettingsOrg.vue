<script lang="ts" setup>
import ElInput from '@fiction/ui/ElInput.vue'
import ElButton from '@fiction/ui/ElButton.vue'
import ElAvatar from '@fiction/ui/ElAvatar.vue'
import type { Organization, UserMeta } from '@fiction/core'
import { emitEvent, log, useService, vue } from '@fiction/core'
import type { Card } from '@fiction/site/card'
import ElPanelSettings from './ElPanelSettings.vue'
import UtilDeleteOrg from './UtilDeleteOrg.vue'
import UtilListOrganizations from './UtilListOrganizations.vue'

import type { UserConfig } from './SettingsWrap.vue'

defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const { fictionUser } = useService()

const form = vue.ref<Partial<Organization>>({})
const defaultConfig = { disableWatermark: false, serverTimeoutMinutes: 20 }
const config = vue.ref<{ serverTimeoutMinutes?: number, disableWatermark?: boolean }>(defaultConfig)
const meta = vue.ref<Partial<UserMeta>>({})
const sending = vue.ref<string | boolean>(false)
const sent = vue.ref(false)

const org = vue.computed<Organization | undefined>(() => fictionUser.activeOrganization.value)

async function saveOrganization(): Promise<void> {
  if (!form.value.orgId)
    throw new Error('No organization id')

  const fields = { ...form.value, meta: meta.value, config: config.value }

  await fictionUser.requests.ManageOrganization.request(
    { _action: 'update', orgId: form.value.orgId, org: fields },
    { debug: true },
  )
}

async function send(context: string): Promise<void> {
  sending.value = context

  await saveOrganization()
  sent.value = true
  sending.value = false
}

vue.onMounted(async () => {
  const user = await fictionUser.userInitialized()

  if (org.value) {
    form.value = org.value
    config.value = { ...defaultConfig, ...org.value.config }
  }
  else {
    log.error('SETTINGS', 'no org', { data: { user } })
  }
})

vue.onMounted(async () => {
  await fictionUser.userInitialized()
  vue.watch(
    () => fictionUser.activeOrganization.value,
    (v) => {
      if (v) {
        form.value = v
        meta.value = v.meta ?? {}
      }
    },
    { immediate: true },
  )
})
</script>

<template>
  <div class=" ">
    <ElPanelSettings title="Organization Settings">
      <div class="space-y-12">
        <div class="flex items-center space-x-4">
          <div>
            <ElAvatar
              :email="fictionUser.activeOrganization.value?.orgEmail"
              class="h-16 w-16 rounded-full"
            />
          </div>
          <div>
            <div class="font-brand text-4xl font-bold">
              {{ fictionUser.activeOrganization.value?.orgName }}
            </div>
            <div class="text-theme-500 font-medium">
              billing email:
              {{ fictionUser.activeOrganization.value?.orgEmail }}
              &middot; you are an
              <span class="">{{
                fictionUser.activeOrganization.value?.relation?.memberAccess
              }}</span>
            </div>
          </div>
        </div>
        <div class="space-y-6">
          <div class="max-w-md space-y-6">
            <ElInput
              v-model="form.orgName"
              input="InputText"
              label="Organization Name"
              required
              @keyup.enter.stop="emitEvent('submit')"
            />

            <ElInput
              v-model="form.orgEmail"
              input="InputText"
              label="Organization Email"
              sub-label="Used for billing, notifications, avatar"
              placeholder="billing@example.com"
              @keyup.enter.stop="emitEvent('submit')"
            />

            <ElInput
              v-model="form.username"
              input="InputText"
              label="Username"
              placeholder="acme-inc"
              sub-label="Used in public profiles, must be unique."
            />
            <div>
              <ElButton
                btn="primary"
                size="sm"
                :loading="sending === 'settings'"
                @click="send('settings')"
              >
                Save Changes
              </ElButton>
            </div>
          </div>
        </div>
      </div>
    </ElPanelSettings>
    <ElPanelSettings
      title="Your Organizations"
      :actions="[
        { name: 'Create New Organization', href: card.link(`/settings/new-org`) },
      ]"
    >
      <UtilListOrganizations :card="card" />
    </ElPanelSettings>
    <ElPanelSettings
      v-if="!fictionUser.activeUser.value?.isSuperAdmin"
      title="Admin Only Settings"
      class="p-4 border border-theme-200/75 dark:border-theme-600 bg-theme-50/50 dark:bg-theme-700 rounded-md m-4"
    >
      <div class="space-y-12">
        <div class="space-y-4">
          <ElInput
            v-model="form.specialPlan"
            label="Special Plan"
            sub-label="Give this organization a special pricing plan"
            input="InputSelect"
            :list="[
              { name: 'none', value: '' },
              { name: 'VIP', value: 'vip' },
            ]"
          />

          <div>
            <ElButton
              btn="primary"
              size="sm"
              :loading="sending === 'admin'"
              @click="send('admin')"
            >
              Save Changes
            </ElButton>
          </div>
        </div>

        <UtilDeleteOrg :card="card" />
      </div>
    </ElPanelSettings>
  </div>
</template>
