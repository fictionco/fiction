<script lang="ts" setup>
import { resetUi } from '@factor/api'
import ElemButton from '@kaption/dashboard/src/el/ElemButton.vue'
import ElemAvatar from '@kaption/dashboard/src/el/ElemAvatar.vue'
import ElemForm from '@factor/ui/ElemForm.vue'
import ElemInput from '@factor/ui/ElemInput.vue'

import ElemSlideOver from '@kaption/dashboard/src/_global/ElemSlideOver.vue'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { activeOrganizations } from '@kaption/dashboard'
import type { Organization, OrganizationMember } from '@kaption/types'
import { MemberAccess } from '@kaption/types'
import {
  requestManageEndpoint,
  requestResendInvite,
} from '@kaption/dashboard/src/_manage/request'

const router = useRouter()
const route = useRoute()

const form = ref<{ memberAccess?: MemberAccess }>({})
const sending = ref<string | boolean>(false)
const sent = ref(false)
const isValid = ref<boolean>(false)
const userId = computed(() => route.query.userId as string | undefined)
const organizationId = computed(
  () => route.query.organizationId as string | undefined,
)

const organization = computed((): Organization | undefined => {
  const organizationId = route.query.organizationId as string | undefined

  if (!organizationId)
    return undefined

  const org = activeOrganizations.value.find(
    _ => _.organizationId === organizationId,
  )
  return org
})

const member = computed<Partial<OrganizationMember> | undefined>(() => {
  const userId = route.query.userId as string | undefined

  if (!userId || !organization.value)
    return undefined

  return organization.value.members.find(member => member.userId === userId)
})

async function setMemberRelation(action: 'update' | 'delete'): Promise<void> {
  if (!userId.value)
    throw new Error('user id is required')
  if (!organizationId.value)
    throw new Error('organization id is required')
  const r = await requestManageEndpoint('manageMemberRelation', {
    userId: userId.value,
    organizationId: organizationId.value,
    memberAccess: member.value?.memberAccess ?? MemberAccess.Observer,
    action,
  })

  if (r.status === 'success')
    await router.replace({ query: {} })
}
/**
 * Request to update user
 */
async function send(): Promise<void> {
  sending.value = 'update'

  if (!userId.value)
    throw new Error('user id is required')
  if (!organizationId.value)
    throw new Error('organization id is required')

  await setMemberRelation('update')

  sent.value = true

  sending.value = false

  resetUi()
}

async function resendInvite(): Promise<void> {
  if (!organizationId.value || !member.value?.email)
    return
  sending.value = 'invite'
  await requestResendInvite(organizationId.value, [member.value?.email])
  sending.value = false
}

async function maybeRemoveMember(): Promise<void> {
  const confirmed = confirm('Are you sure?')

  if (confirmed) {
    sending.value = 'delete'
    await setMemberRelation('delete')
    sending.value = false
  }
}
</script>

<template>
  <ElemSlideOver name="editMember">
    <div
      class="flex items-center justify-center h-12 w-12 rounded-full bg-green-100"
    >
      <svg
        class="h-6 w-6 text-green-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
    <div class="py-3">
      <h2 class="text-xl font-semibold">
        Member Information
      </h2>
      <p class="text-slate-500">
        Team member information and user role options.
      </p>
    </div>
    <div class="py-6">
      <!-- <h2 class="mb-2 font-semibold">Member</h2> -->
      <div class="flex items-center">
        <ElemAvatar
          v-if="member"
          class="w-10 h-10 rounded-full"
          :email="member.email"
        />
        <div class="ml-3">
          <p class="text-gray-500">
            <span class="mr-2">
              {{ member?.fullName || member?.email }}
            </span>
          </p>
          <p class="text-sm text-slate-500">
            {{ member?.email }}
          </p>
        </div>
      </div>
    </div>
    <div class="py-6">
      <div class="border-b border-slate-200 pb-3">
        <p class="mb-1 max-w-2xl text-sm text-slate-500">
          Organization Name
        </p>
        <h3 class="text-xl leading-6 font-medium">
          {{ organization?.organizationName }}
        </h3>
      </div>
    </div>
    <ElemForm
      v-if="member"
      v-model:valid="isValid"
      @submit="send()"
    >
      <ElemInput
        v-model="member.memberAccess"
        class="max-w-sm"
        input="selectCustom"
        label="Organization Access"
        description="Edit the access the member has to the organization"
        :list="[
          { value: 'owner', name: 'Owner' },
          { value: 'admin', name: 'Administrator' },
          { value: 'editor', name: 'Editor (Read/Write)' },
          { value: 'observer', name: 'Observer (Read Only)' },
        ]"
      />

      <div
        class="border-t border-slate-200 pt-4 flex justify-between items-center"
      >
        <div />
        <ElemButton
          type="submit"
          btn="primary"
          :loading="sending === 'update'"
        >
          Save &rarr;
        </ElemButton>
      </div>
    </ElemForm>
    <div v-if="member.memberStatus === 'pending'" class="py-6">
      <div class="border-b border-slate-200 pb-3">
        <h3 class="text-lg leading-6 font-semibold">
          Pending Invite
        </h3>
      </div>
      <div>
        <ElemInput
          label="Resend Invitatation"
          description="This user is pending, resend the invite?"
        >
          <div class="pt-4 rounded-md">
            <ElemButton
              :loading="sending === 'invite'"
              btn="default"
              @click="resendInvite()"
            >
              Resend Invite
            </ElemButton>
          </div>
        </ElemInput>
      </div>
    </div>
    <div class="py-6">
      <div class="border-b border-slate-200 pb-3">
        <h3 class="text-lg leading-6 font-semibold">
          Danger Zone
        </h3>
      </div>
      <div>
        <ElemInput
          label="Remove From Organization"
          description="Permanently delete this project and its data."
        >
          <div class="pt-4 rounded-md">
            <ElemButton
              :loading="sending === 'delete'"
              btn="danger"
              @click="maybeRemoveMember()"
            >
              Remove Member
            </ElemButton>
          </div>
        </ElemInput>
      </div>
    </div>
  </ElemSlideOver>
</template>
