<script lang="ts" setup>
import ElemForm from '@factor/ui/ElemForm.vue'
import ElemInput from '@factor/ui/ElemInput.vue'
import InputEmail from '@factor/ui/InputEmail.vue'
import InputSelect from '@factor/ui/InputSelect.vue'
import ElemButton from '@kaption/dashboard/src/el/ElemButton.vue'
import { computed, ref } from 'vue'
import { activeOrganizations, currentUserCan } from '@kaption/dashboard'
import type { Organization } from '@kaption/types'
import { MemberAccess } from '@kaption/types'
import { requestManageEndpoint } from '@kaption/dashboard/src/_manage/request'
import { onResetUi } from '@factor/api'
import ElemSlideOver from '@kaption/dashboard/src/_global/ElemSlideOver.vue'
import { useRoute, useRouter } from 'vue-router'

interface Invite {
  email: string
  memberAccess: MemberAccess
}
const route = useRoute()
const router = useRouter()
const form = ref({})

const organizationId = computed<string>({
  get: () => route.query.organizationId as string,
  set: async (v) => {
    await router.replace({ query: { ...route.query, organizationId: v } })
  },
})
const isValid = ref<boolean>(false)
const sending = ref(false)
const sent = ref(false)

const defaultInvites = [
  {
    email: '',
    memberAccess: MemberAccess.Admin,
  },
  {
    email: '',
    memberAccess: MemberAccess.Admin,
  },
  {
    email: '',
    memberAccess: MemberAccess.Admin,
  },
]

const invites = ref<Invite[]>([...defaultInvites])

const orgList = computed(() => {
  const list = activeOrganizations.value
    .filter((org: Organization) => currentUserCan('manageOrganization', org))
    .map((org: Organization) => {
      return { name: org.organizationName, value: org.organizationId }
    })

  return list
})

async function sendInvites(): Promise<void> {
  if (isValid.value && organizationId.value) {
    const actualInvites = invites.value.filter(i => i.email)

    const r = await requestManageEndpoint<'teamInvite'>('teamInvite', {
      organizationId: organizationId.value,
      invites: actualInvites,
    })

    if (r.status === 'success') {
      invites.value = [...defaultInvites]
      sent.value = true
    }
  }
}

async function send(): Promise<void> {
  sending.value = true

  await sendInvites()

  sending.value = false
}

onResetUi(() => {
  sent.value = false
})
</script>

<template>
  <ElemSlideOver name="invite">
    <div v-if="sent">
      <div
        class="flex items-center justify-center h-12 w-12 rounded-full bg-green-100"
      >
        <svg
          class="h-6 w-6 text-green-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <div class="py-3">
        <h2 class="text-xl font-semibold">
          Invite Sent!
        </h2>
        <p class="text-slate-500">
          Invite emails sent to the members you provided.
        </p>
      </div>
      <div class="mt-6">
        <ElemButton btn="primary" @click="sent = false">
          Send more invites &rarr;
        </ElemButton>
      </div>
    </div>

    <div v-else>
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
          Invite Team
        </h2>
        <p class="text-slate-500">
          Invited members will be granted access to all projects under the
          selected organization.
        </p>
      </div>

      <ElemForm
        v-model:valid="isValid"
        :data="form"
        @submit="send()"
      >
        <ElemInput
          v-model="organizationId"
          input="selectCustom"
          label="Organization"
          description="Which organization would you like to invite people to?"
          default-value="Select Organization"
          :list="orgList"
          required
        />

        <h2 class="text-lg font-semibold mt-4 mb-2">
          Invitations
        </h2>

        <div class="w-full">
          <div
            class="invite-header grid grid-cols-5 gap-4 font-medium text-slate-500 mb-2"
          >
            <div class="col-span-3">
              Email
            </div>
            <div class="col-span-2">
              Access
            </div>
          </div>

          <div
            v-for="(item, i) in invites"
            :key="i"
            class="invite grid grid-cols-5 gap-4 my-4"
          >
            <InputEmail v-model="invites[i].email" class="col-span-3" />

            <InputSelect
              v-model="invites[i].memberAccess"
              class="col-span-2"
              :list="[
                { value: 'admin', name: 'Admin (Full)' },
                { value: 'editor', name: 'Editor (Read/Write)' },
                { value: 'observer', name: 'Observer (Read Only)' },
              ]"
            />
          </div>
        </div>

        <ElemInput
          input="submit"
          value=""
          :loading="sending"
        >
          Send Invites &rarr;
        </ElemInput>
      </ElemForm>
    </div>
  </ElemSlideOver>
</template>
