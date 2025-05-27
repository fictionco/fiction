<script lang="ts" setup>
import type { ActionButton, Organization } from '@fiction/core'
import type { Card } from '@fiction/site'
import { gravatarUrlSync, useService, vue } from '@fiction/core'
import { OrgSchema as schema } from '@fiction/core/plugin-user/schema'
import { createOption } from '@fiction/ui/index.js'
import FormEngine from '@fiction/ui/inputs/FormEngine.vue'
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
  return o?.avatar ? o?.avatar : (gravatarUrlSync(o?.orgEmail, { size: 400 }))
})

const isDirty = vue.ref(false)

const initialGroupKey = vue.computed(() => {
  return card.site?.siteRouter.query.value?.tab as string | undefined
})

async function save() {
  sending.value = 'saving'
  const endpoint = service.fictionUser.requests.ManageOrganization
  const fields = org.value
  const orgId = fields?.orgId

  if (!orgId)
    return

  await endpoint.projectRequest({ _action: 'update', fields, where: { orgId } })

  isDirty.value = false
  sending.value = ''
}

function update(orgNew: Organization) {
  service.fictionUser.activeOrganization.value = orgNew

  isDirty.value = true
}

const orgHostname = vue.computed(() => {
  const handle = org.value?.handle
  if (!handle)
    return ''

  return `https://${handle}.fiction.com`
})

const opts = vue.computed(() => {
  return [
    createOption({
      schema,
      label: 'Essentials',
      key: 'group.essentials',
      input: 'group',
      icon: { class: 'i-tabler-north-star' },
      options: [
        createOption({
          schema,
          key: 'orgName',
          label: 'Name',
          input: 'InputText',
          placeholder: 'Enter a name',
          isRequired: true,
          description: 'A concise name defining your identity, displayed prominently on your profile.',
        }),
        createOption({
          schema,
          key: 'orgEmail',
          label: 'Email',
          input: 'InputEmail',
          isRequired: true,
          description: 'A primary contact email for communication and account verification.',
        }),
        createOption({
          key: 'handle',
          label: 'Handle',
          input: 'InputHandle',
          placeholder: 'my-handle',
          props: { table: 'fiction_org', columns: [{ name: 'handle' }] },
          description: 'A unique identifier for your profile, used in URLs and mentions.',
        }),
        createOption({
          schema,
          key: 'headline',
          label: 'Headline',
          input: 'InputUrl',
          isRequired: true,
          placeholder: 'Enter a headline',
          description: 'A sharp, 220-character tagline capturing your essence, shown in search results and on your profile.',
        }),
        createOption({
          schema,
          key: 'about',
          label: 'About',
          input: 'InputTextarea',
          isRequired: true,
          placeholder: 'Enter a description',
          description: 'A compelling 2,600-character narrative detailing your mission, values, and story.',
        }),
        createOption({
          schema,
          key: 'avatar',
          label: 'Avatar',
          input: 'InputMedia',
          description: 'A signature image embodying your identity, prominently featured on your profile and in searches.',
        }),
        createOption({
          schema,
          key: 'logo',
          label: 'Logo',
          subLabel: 'For visual identity',
          input: 'InputMedia',
          description: 'An emblem reinforcing your visual identity across the platform.',
        }),
        createOption({
          schema,
          key: 'primaryColor',
          label: 'Primary Color',
          input: 'InputColorTheme',
          placeholder: 'Default',
          description: 'A defining color shaping your visual theme and consistency.',
          props: {
            mode: 'bright',
          },
        }),
      ],
    }),

    createOption({
      schema,
      key: 'group.domain',
      label: 'Domain',
      input: 'group',
      icon: { class: 'i-tabler-world-upload' },
      options: [
        createOption({
          schema,
          key: 'handle',
          label: 'Fiction Domain',
          input: 'InputHandle',
          isRequired: true,
          props: {
            beforeInput: 'https://',
            afterInput: '.fiction.com',
            table: 'fiction_org',
            columns: [{ name: 'handle' }],
            uiSize: 'md',
          },
        }),
        createOption({
          key: 'customDomains',
          label: 'Enter Custom Domain',
          subLabel: 'Add custom domains for this site (e.g. www.example.com)',
          input: vue.defineAsyncComponent(() => import('./CustomDomain.vue')),
          isRequired: true,
        }),
        createOption({
          key: 'domainSetupInstructions',
          label: 'Setup Instructions',
          input: vue.defineAsyncComponent(() => import('./CustomDomainInstructions.vue')),
          props: {
            destination: orgHostname.value,
          },
        }),

      ],
    }),
    createOption({
      key: 'group.social',
      label: 'Social',
      input: 'group',
      icon: { class: 'i-tabler-social' },
      options: [
        createOption({ schema, key: 'accounts.x', label: 'X / Twitter Username', input: 'InputText', placeholder: 'username' }),
        createOption({ schema, key: 'accounts.instagram', label: 'Instagram Username', input: 'InputText', placeholder: 'username' }),
        createOption({ schema, key: 'accounts.linkedin', label: 'LinkedIn Username', input: 'InputText', placeholder: 'username' }),
        createOption({ schema, key: 'accounts.facebook', label: 'Facebook Username', input: 'InputText', placeholder: 'username' }),
        createOption({ schema, key: 'accounts.github', label: 'GitHub Username', input: 'InputText', placeholder: 'username' }),
        createOption({ schema, key: 'accounts.youtube', label: 'YouTube Username', input: 'InputText', placeholder: 'username' }),
        createOption({ schema, key: 'accounts.pinterest', label: 'Pinterest Username', input: 'InputText', placeholder: 'username' }),
        createOption({ schema, key: 'accounts.tiktok', label: 'TikTok Username', input: 'InputText', placeholder: 'username' }),
      ],
    }),
    createOption({
      schema,
      key: 'group.additional',
      label: 'Advanced',
      input: 'group',
      icon: { class: 'i-tabler-bolt' },
      options: [

        createOption({
          schema,
          key: 'googleAnalyticsId',
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
})

const header = vue.computed(() => {
  return {
    title: org.value?.orgName,
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
      :options="opts"
      :card
      :disable-group-hide="true"
      :initial-group-key="initialGroupKey"
      @update:model-value="update($event)"
    />
  </SettingsPanel>
</template>
