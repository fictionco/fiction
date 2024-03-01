<script lang="ts" setup>
import ElInput from '@factor/ui/ElInput.vue'
import ElForm from '@factor/ui/ElForm.vue'
import type {
  FactorRouter,
  FactorUser,
} from '@factor/api'
import {
  emitEvent,
  useService,
  vue,
  vueRouter,
} from '@factor/api'

import AccountWrap from '../AccountWrap.vue'

const { factorRouter, factorUser } = useService<{
  factorRouter: FactorRouter
  factorUser: FactorUser
}>()

const router = vueRouter.useRouter()
const form = vue.ref({
  organizationName: '',
  organizationEmail: '',
})
const formError = vue.ref('')
const sending = vue.ref(false)
const disabled = vue.computed(() => form.value.organizationName.length <= 2)

vue.onMounted(async () => {
  await factorUser.userInitialized()
})

async function send(): Promise<void> {
  sending.value = true

  const { organizationName, organizationEmail } = form.value

  const userId = factorUser.activeUser.value?.userId

  if (!userId)
    throw new Error('userId is missing')

  const r = await factorUser.requests.ManageOrganization.request({
    userId,
    organization: { organizationName, organizationEmail },
    _action: 'create',
  })

  if (r.status === 'success') {
    const organizationId = r.data?.organizationId
    await router.push(factorRouter.link('teamInvite', { organizationId }).value)
  }
  sending.value = false
}
</script>

<template>
  <AccountWrap title="Create New Organization">
    <div class="max-w-xl p-6">
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
          v-model="form.organizationName"
          class="my-8"
          input="InputText"
          label="Organization Name"
          placeholder="My Organization"
          sub-label="You can change this later"
          required
          @keyup.enter.stop="emitEvent('submit')"
        />

        <ElInput
          v-model="form.organizationEmail"
          class="my-8"
          input="InputEmail"
          label="Primary Organization Email"
          sub-label="Used for notifications and billing"
          placeholder="example@organization.com"
          required
          @keyup.enter.stop="emitEvent('submit')"
        />
      </ElForm>
    </div>
  </AccountWrap>
</template>
