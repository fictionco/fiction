<script lang="ts" setup>
import { emitEvent, useService, vue, vueRouter } from '@fiction/core'
import ElInput from '@fiction/ui/ElInput.vue'
import ElForm from '@fiction/ui/ElForm.vue'
import type { Card } from '../../../card'
import ElPanelSettings from './ElPanelSettings.vue'

type UserConfig = { isNavItem?: boolean, icon?: string, parentItemId?: string }
const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const { factorUser } = useService()

const router = vueRouter.useRouter()
const form = vue.ref({
  orgName: '',
  orgEmail: '',
})
const formError = vue.ref('')
const sending = vue.ref(false)

vue.onMounted(async () => {
  await factorUser.userInitialized()
})

async function send(): Promise<void> {
  sending.value = true

  const { orgName, orgEmail } = form.value

  const userId = factorUser.activeUser.value?.userId

  if (!userId)
    throw new Error('userId is missing')

  const r = await factorUser.requests.ManageOrganization.request({
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
  <ElPanelSettings>
    <div class="max-w-xl">
      <ElForm
        :notify="formError"
        :actions="[
          {
            name: 'Create New Organization',
            loading: sending,
            btn: 'primary',
            onClick: () => send(),
          },
        ]"
      >
        <ElInput
          v-model="form.orgName"
          class="my-8"
          input="InputText"
          label="Organization Name"
          placeholder="My Organization"
          sub-label="You can change this later"
          required
          @keyup.enter.stop="emitEvent('submit')"
        />

        <ElInput
          v-model="form.orgEmail"
          class="my-8"
          input="InputEmail"
          label="Primary Organization Email"
          sub-label="Used for notifications and billing"
          placeholder="example@org.com"
          required
          @keyup.enter.stop="emitEvent('submit')"
        />
      </ElForm>
    </div>
  </ElPanelSettings>
</template>
