<script lang="ts" setup>
import type { ActionButton, Organization } from '@fiction/core'
import type { Card } from '@fiction/site'
import { gravatarUrlSync, useService, vue } from '@fiction/core'
import { OrgSchema as schema } from '@fiction/core/plugin-user/schema'
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

const isDirty = vue.ref(false)

async function save() {
  sending.value = 'saving'
  const endpoint = service.fictionUser.requests.ManageOrganization
  const fields = org.value
  const orgId = fields?.orgId

  if (!orgId)
    return

  await endpoint.projectRequest({ _action: 'update', fields, where: { orgId } })

  isDirty.value = false
}

function update(orgNew: Organization) {
  service.fictionUser.activeOrganization.value = orgNew

  isDirty.value = true
}

const o = [
  createOption({
    schema,
    key: 'group.brand',
    label: 'Important Details',
    input: 'group',
    options: [
      createOption({ schema, key: 'orgName', label: 'Name', input: 'InputText', placeholder: 'Enter a name', isRequired: true }),
      createOption({ schema, key: 'headline', label: 'Tagline', input: 'InputUrl', isRequired: true, placeholder: 'Enter a tagline' }),
      createOption({ schema, key: 'about', label: 'About', input: 'InputTextarea', isRequired: true, placeholder: 'Enter a description' }),
      createOption({ schema, key: 'avatar', label: 'Avatar', input: 'InputMedia' }),
      createOption({ key: 'handle', label: 'Handle', input: 'InputHandle', placeholder: 'my-handle', props: { table: 'fiction_org', columns: [{ name: 'handle' }] } }),
      createOption({ schema, key: 'orgEmail', label: 'Billing and Contact Email', input: 'InputEmail', isRequired: true }),
    ],
  }),
  createOption({
    schema,
    key: 'group.additional',
    label: 'Additional Settings',
    input: 'group',
    options: [
      createOption({ schema, key: 'companyName', label: 'Company Name', input: 'InputText', placeholder: 'Acme, Inc.', props: { autocomplete: 'organization' } }),
      createOption({ schema, key: 'streetAddress', label: 'Street Address', input: 'InputText', placeholder: '123 Main St, City, State, Zip', props: { autocomplete: 'street-address' } }),

    ],
  }),
  createOption({
    key: 'adminOnly',
    label: 'Admin Only Options',
    input: 'group',
    isHidden: !service.fictionUser.activeUser.value?.isSuperAdmin,
    options: [
      createOption({ schema, key: 'specialPlan', label: 'Assign a Special Pricing Plan', input: 'InputSelect', list: ['standard', 'vip', 'non-profit'] }),
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
    :action="{
      buttons: [{
        testId: 'saveButton',
        label: isDirty ? 'Save Changes' : 'Changes Saved',
        onClick: () => save(),
        theme: isDirty ? 'primary' : 'default',
        loading: sending === 'saving',
        icon: isDirty ? 'i-tabler-upload' : 'i-tabler-check',
        animate: false,
      }],
    }"
    :header
  >
    <FormEngine
      :model-value="org"
      state-key="settingsTool"
      ui-size="lg"
      :options="o"
      :card
      :disable-group-hide="true"
      @update:model-value="update($event)"
    />
  </SettingsPanel>
</template>
