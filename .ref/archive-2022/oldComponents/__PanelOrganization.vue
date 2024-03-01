<script lang="ts" setup>
import { activeUser, emitEvent } from '@factor/api'
import ElemForm from '@factor/ui/ElemForm.vue'
import ElemInput from '@factor/ui/ElemInput.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ElemButton from '../el/ElemButton.vue'
import ElemSlideOver from '../_global/ElemSlideOver.vue'
import { getRoute } from '..'
import { requestManageEndpoint } from './request'

interface PanelForm {
  organizationName: string
  organizationEmail: string
}

const router = useRouter()
const form = ref<Partial<PanelForm>>({
  organizationName: '',
  organizationEmail: '',
})
const sending = ref(false)
const isValid = ref<boolean>(false)

async function createOrganization() {
  const { organizationName, organizationEmail } = form.value
  const r = await requestManageEndpoint<'manageOrganization'>(
    'manageOrganization',
    {
      action: 'create',
      organizationName,
      organizationEmail,
      userId: activeUser.value?.userId,
    },
  )

  if (r.status === 'success') {
    const org = r.data
    router.push(getRoute('orgEdit', { organizationId: org?.organizationId }))
  }
}

async function send(): Promise<void> {
  sending.value = true
  await createOrganization()
  sending.value = false
}
</script>

<template>
  <ElemSlideOver name="newOrganization">
    <div
      class="flex items-center justify-center h-12 w-12 rounded-full bg-primary-100"
    >
      <svg
        class="h-6 w-6 text-primary-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    </div>

    <div class="py-3">
      <h2 class="text-xl font-semibold">
        Create A New Organization
      </h2>
      <p class="text-slate-500">
        Group your projects into Organizations to separate user access, metrics,
        and payment.
      </p>
    </div>

    <ElemForm
      v-model:valid="isValid"
      :data="form"
      @submit="send()"
    >
      <ElemInput
        v-model="form.organizationName"
        input="text"
        label="Organization Name"
        placeholder="Org Name"
        required
        @keyup.enter.stop="emitEvent('submit')"
      />

      <ElemInput
        v-model="form.organizationEmail"
        input="email"
        label="Organization Email"
        placeholder="example@organization.com"
        required
        @keyup.enter.stop="emitEvent('submit')"
      />

      <ElemButton
        type="submit"
        value=""
        btn="primary"
        :loading="sending"
      >
        Create New Organization &rarr;
      </ElemButton>
    </ElemForm>
  </ElemSlideOver>
</template>
