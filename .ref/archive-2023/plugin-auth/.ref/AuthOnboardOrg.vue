<script lang="ts" setup>
import { emitEvent, vue, vueRouter } from '@factor/api'
import ElInput from '@factor/ui/ElInput.vue'
import ElForm from '@factor/ui/ElForm.vue'
import { useKaption } from '../../utils'
import RegisterWrap from '../AuthWrap.vue'

const { factorRouter, factorUser, kaptionAdmin } = useKaption()
const router = vueRouter.useRouter()
const form = vue.ref({
  organizationName: '',
  organizationEmail: '',
  memberRole: '',
  manageClients: false,
  organizationSize: 0,
})
const formError = vue.ref('')
const sending = vue.ref(false)
const disabled = vue.computed(
  () =>
    form.value.organizationName.length <= 2
    || form.value.memberRole === ''
    || form.value.organizationSize === 0,
)

vue.onMounted(async () => {
  await factorUser.userInitialized()
  form.value.organizationEmail = factorUser.activeUser.value?.email ?? ''
})

async function send(): Promise<void> {
  sending.value = true

  const {
    organizationName,
    memberRole,
    manageClients,
    organizationSize,
    organizationEmail,
  } = form.value

  const userId = factorUser.activeUser.value?.userId

  if (!userId)
    throw new Error('user id is missing')

  const r = await kaptionAdmin.requests.ManageOrganization.request({
    userId,
    organizationName,
    organizationEmail,
    memberRole,
    manageClients,
    organizationSize,
    _action: 'create',
  })

  if (r.status === 'success')
    await router.push(factorRouter.to('authOnboardProject'))

  sending.value = false
}
</script>

<template>
  <RegisterWrap title="Create Organization" :loading="sending">
    <ElForm :notify="formError" @submit="send()">
      <ElInput
        v-model="form.organizationName"
        input="InputText"
        label="Organization Name"
        description="You can change this later"
        required
        @keyup.enter.stop="emitEvent('submit')"
      />

      <ElInput
        v-model="form.memberRole"
        input="InputSelectCustom"
        label="What's Your Role?"
        :list="[
          'analytics',
          'marketing',
          'product',
          'owner',
          'designer',
          'developer',
          'consultant',
          'personal',
          'other',
        ]"
        required
      />
      <ElInput
        v-model="form.organizationSize"
        input="InputSelectCustom"
        label="Organization Size"
        description="This will help us allocate server resources."
        :list="[
          { name: '1-4', value: 1 },
          { name: '5-10', value: 5 },
          { name: '11-24', value: 10 },
          { name: '25-50', value: 25 },
          { name: '51-100', value: 50 },
          { name: '100-300', value: 100 },
          { name: '300+', value: 300 },
        ]"
        required
        @keyup.enter.stop="emitEvent('submit')"
      />
      <ElInput
        v-model="form.manageClients"
        input="InputToggle"
        label="Will you use this service for clients?"
        description="We'll make setting this up easy"
        text-on="Yes"
        text-off="No"
      />
      <ElInput
        v-model="form.organizationEmail"
        input="InputEmail"
        label="Primary Email"
        description="For alerts and billing"
        placeholder="example@organization.com"
        required
        @keyup.enter.stop="emitEvent('submit')"
      />
      <div class="action">
        <button
          type="submit"
          class="bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 w-full items-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
          :class="disabled ? 'opacity-80 cursor-not-allowed' : ''"
          :disabled="disabled"
        >
          Continue
        </button>
      </div>
    </ElForm>
  </RegisterWrap>
</template>
