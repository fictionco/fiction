<script lang="ts" setup>
import ElInput from '@factor/ui/ElInput.vue'
import ElButton from '@factor/ui/ElButton.vue'
import ElPanel from '@factor/ui/ElPanel.vue'
import ElAvatar from '@factor/ui/ElAvatar.vue'
import AdminUtilDeleteOrg from '@factor/ui/AdminUtilDeleteOrg.vue'
import type {
  FactorRouter,
  FactorUser,
  Organization,
  UserMeta,
} from '@factor/api'
import {
  emitEvent,
  useService,
  vue,
} from '@factor/api'
import type { FictionUsage } from '../plugin-usage'
import type { FictionPayment } from '../plugin-payment'
import AdminPageSettings from './AdminPageSettings.vue'

const { factorRouter, factorUser, fictionPayment } = useService<{
  factorRouter: FactorRouter
  factorUser: FactorUser
  fictionUsage: FictionUsage
  fictionPayment: FictionPayment
}>()
const router = factorRouter.router
const form = vue.ref<Partial<Organization>>({})
const defaultConfig = { disableWatermark: false, serverTimeoutMinutes: 20 }
const config = vue.ref<{
  serverTimeoutMinutes?: number
  disableWatermark?: boolean
}>(defaultConfig)
const meta = vue.ref<Partial<UserMeta>>({})
const sending = vue.ref<string | boolean>(false)
const sent = vue.ref(false)

const organizationId = vue.computed<string>(
  () => router.currentRoute.value.params.organizationId as string,
)

const activeCustomer = vue.computed(() => {
  return fictionPayment.activeCustomer.value
})

const organization = vue.computed<Organization | undefined>(() => {
  const org = factorUser.activeOrganizations.value.find(
    _ => _.organizationId === organizationId.value,
  )
  return org
})

async function saveOrganization(): Promise<void> {
  if (!form.value.organizationId)
    throw new Error('No organization id')

  const fields = { ...form.value, meta: meta.value, config: config.value }

  await factorUser.requests.ManageOrganization.request(
    {
      _action: 'update',
      organizationId: form.value.organizationId,
      organization: fields,
    },
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
  await factorUser.userInitialized()

  if (organization.value) {
    form.value = organization.value
    config.value = { ...defaultConfig, ...organization.value.config }
  }
  else {
    emitEvent('notifyError', `can't find that organization`)
    await router.push(factorRouter.link('organizationIndex').value)
  }
})

vue.onMounted(async () => {
  await factorUser.userInitialized()
  vue.watch(
    () => factorUser.activeOrganization.value,
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
  <AdminPageSettings access="manager">
    <div class="space-y-6">
      <ElPanel box-class="p-0" title="Organization">
        <div class="border-theme-300 flex items-center space-x-4 border-b p-8">
          <div>
            <ElAvatar
              :email="factorUser.activeOrganization.value?.organizationEmail"
              class="h-16 w-16 rounded-full"
            />
          </div>
          <div>
            <div class="text-2xl font-extrabold">
              {{ factorUser.activeOrganization.value?.organizationName }}
            </div>
            <div class="text-theme-500 font-medium">
              billing email:
              {{ factorUser.activeOrganization.value?.organizationEmail }}
              &middot; you are an
              <span class="">{{
                factorUser.activeOrganization.value?.relation?.memberAccess
              }}</span>
            </div>
          </div>
        </div>
        <div class="space-y-6 p-8">
          <div class="max-w-md space-y-6">
            <ElInput
              v-model="form.organizationName"
              input="InputText"
              label="Organization Name"
              required
              @keyup.enter.stop="emitEvent('submit')"
            />

            <ElInput
              v-model="form.organizationEmail"
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
                :loading="sending === 'settings'"
                @click="send('settings')"
              >
                Save Changes
              </ElButton>
            </div>
          </div>
        </div>
      </ElPanel>
      <ElPanel title="AI and Server">
        <div class="grid grid-cols-1 text-sm md:grid-cols-2">
          <div class="space-y-6">
            <ElInput
              v-model="config.serverTimeoutMinutes"
              label="Server Idle Timeout (Minutes)"
              sub-label="Automatically pause the server after this many minutes of inactivity. Default is 20 minutes."
              input="InputRange"
              :min="10"
              :max="60"
              :default-value="20"
            />
            <ElInput
              v-if="activeCustomer"
              v-model="config.disableWatermark"
              label="Disable Watermarks"
              sub-label="Disable to remove any watermarks from generated media. Requires standard plan or better."
              input="InputToggle"
              :disabled="activeCustomer.tier < 20"
            />
            <div>
              <ElButton
                btn="primary"
                :loading="sending === 'server'"
                @click="send('server')"
              >
                Save Changes
              </ElButton>
            </div>
          </div>
        </div>
      </ElPanel>
      <ElPanel
        v-if="factorUser.activeUser.value?.isSuperAdmin"
        title="Fiction Admin"
      >
        <div class="grid grid-cols-1 text-sm md:grid-cols-2">
          <div class="space-y-6">
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
                :loading="sending === 'admin'"
                @click="send('admin')"
              >
                Save Changes
              </ElButton>
            </div>
          </div>
        </div>
      </ElPanel>

      <AdminUtilDeleteOrg />
    </div>
  </AdminPageSettings>
</template>
