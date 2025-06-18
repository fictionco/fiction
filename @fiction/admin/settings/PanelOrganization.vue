<script lang="ts" setup>
import type { ActionButton, Organization } from '@fiction/core'
import type { Card } from '@fiction/site'
import { gravatarUrlSync, useService, vue } from '@fiction/core'
import { OrgSchema as schema } from '@fiction/core/plugin-user/schema'
import { AutosaveUtility } from '@fiction/core/utils/save'
import { createOption } from '@fiction/ui/index.js'
import FormEngine from '@fiction/ui/inputs/FormEngine.vue'
import { getOrgSettings } from './index.js'
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

const avatarUrl = vue.computed(() => {
  const o = org.value
  return o?.avatar ? o?.avatar : (gravatarUrlSync(o?.email, { size: 400 }))
})

const isDirty = vue.ref(false)

const initialGroupKey = vue.computed(() => {
  return card.site?.siteRouter.query.value?.tab as string | undefined
})

const orgModel = vue.ref<Organization | undefined>(org.value)

async function save() {
  sending.value = 'saving'
  const endpoint = service.fictionUser.requests.ManageOrganization
  const fields = orgModel.value
  const orgId = fields?.orgId

  if (!orgId)
    return

  await endpoint.projectRequest({ _action: 'update', fields, where: { orgId } })

  orgModel.value = service.fictionUser.activeOrganization.value

  isDirty.value = false
  sending.value = ''
}

const saveUtil = new AutosaveUtility({
  onSave: () => save(),
})

function update(changedOrg: Organization) {
  orgModel.value = changedOrg
  saveUtil.autosave({ caller: 'updateOrg' })
}

const opts = vue.computed(() => {
  const o = org.value

  const orgOptions = getOrgSettings({ org: o })
  return [
    orgOptions.essentials,
    orgOptions.domain,
    orgOptions.social,
    createOption({
      schema,
      key: 'group.additional',
      label: 'Advanced',
      input: 'group',
      icon: { class: 'i-tabler-bolt' },
      options: [

        createOption({
          schema,
          key: 'tracking.googleAnalyticsId',
          label: 'Google Analytics ID',
          description: 'Your Measurement ID (G-XXXXXXXXXX) to enable website analytics tracking.',
          input: 'InputText',
          placeholder: 'G-XXXXXXXXXX',
        }),
        createOption({
          key: 'apiSecret',
          label: 'Secret API Key',
          description: 'A secure key for API access; keep confidential and avoid client-side exposure.',
          input: InputApiKey,
          props: { card },
        }),
      ],
    }),

    createOption({
      key: 'adminOnly',
      label: 'Admin Only Options',
      input: 'group',
      isHidden: !service.fictionUser.activeUser.value?.isSuperAdmin,
      options: [
        createOption({
          schema,
          key: 'billing.specialPlan',
          label: 'Assign a Special Pricing Plan',
          input: 'InputSelect',
          list: ['standard', 'vip', 'non-profit'],
        }),
        createOption({
          key: 'control.delete',
          testId: 'deleteOrg',
          label: 'Delete Brand Workspace',
          input: 'InputActionList',
          icon: { class: 'i-tabler-trash' },
          props: {
            buttons: () => [
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
          },
        }),
      ],
      icon: { class: 'i-tabler-shield-lock' },
    }),
  ]
})

const header = vue.computed(() => {
  return {
    title: org.value?.name,
    subTitle: `Brand - id:${org.value?.orgId}`,
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
    title="Global Settings"
    :loading
    :action="{
      buttons: [{
        testId: 'saveButton',
        label: saveUtil.isDirty.value ? 'Saving' : 'Changes Saved',
        onClick: () => save(),
        theme: saveUtil.isDirty.value ? 'orange' : 'primary',
        design: 'outline',
        loading: sending === 'saving',
        icon: saveUtil.isDirty.value ? 'i-tabler-rotate-clockwise' : 'i-tabler-check',
        animate: false,
      }],
    }"
    :header
  >
    <FormEngine
      :model-value="orgModel"
      state-key="settingsTool"
      ui-size="lg"
      :options="opts"
      :card
      :disable-group-hide="true"
      :initial-group-key="initialGroupKey"
      @update:model-value="update($event)"
    />
  </SettingsPanel>
</template>
