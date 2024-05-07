<script lang="ts" setup>
import { emitEvent, useService, vue, vueRouter } from '@fiction/core'
import ElInput from '@fiction/ui/inputs/ElInput.vue'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import type { Card } from '@fiction/site/card'
import ElPanelSettings from './ElPanelSettings.vue'

import type { UserConfig } from './SettingsWrap.vue'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const { fictionUser } = useService()

const router = vueRouter.useRouter()
const form = vue.ref({
  orgName: '',
  orgEmail: '',
})
const formError = vue.ref('')
const sending = vue.ref(false)

vue.onMounted(async () => {
  await fictionUser.userInitialized()
})

async function send(): Promise<void> {
  sending.value = true

  const { orgName, orgEmail } = form.value

  const userId = fictionUser.activeUser.value?.userId

  if (!userId)
    throw new Error('userId is missing')

  const r = await fictionUser.requests.ManageOrganization.request({
    userId,
    org: { orgName, orgEmail },
    _action: 'create',
  })

  if (r.status === 'success') {
    const orgId = r.data?.orgId
    await router.push(props.card.link(`/settings/team-invite?orgId=${orgId}`))
  }
  sending.value = false
}
</script>

<template>
  <ElPanelSettings title="Create Organization">
    <div class="max-w-xl">
      <ElForm
        :notify="formError"
        class="space-y-8"
        @submit="send()"
      >
        <ElInput
          v-model="form.orgName"
          input="InputText"
          label="Organization Name"
          placeholder="My Organization"
          sub-label="You can change this later"
          required
          @keyup.enter.stop="emitEvent('submit')"
        />

        <ElInput
          v-model="form.orgEmail"
          input="InputEmail"
          label="Primary Organization Email"
          sub-label="Used for notifications and billing"
          placeholder="example@org.com"
          required
          @keyup.enter.stop="emitEvent('submit')"
        />

        <ElInput input="InputSubmit">
          Create New Organization
        </ElInput>
      </ElForm>
    </div>
  </ElPanelSettings>
</template>
