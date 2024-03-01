<script lang="ts" setup>
import { currentUser, emitEvent, requestUserEndpoint } from '@factor/api'
import { computed, ref } from 'vue'
import ElemForm from '@factor/ui/ElemForm.vue'
import ElemInput from '@factor/ui/ElemInput.vue'
import { useRoute, useRouter } from 'vue-router'
import ElemButton from '../el/ElemButton.vue'
import ElemSlideOver from '../_global/ElemSlideOver.vue'
import type {
  Organization,
  Plan,
} from '..'
import {
  activeOrganizations,
  currentUserCan,
  getRoute,
  projectTypes,
} from '..'
import { requestManageEndpoint } from './request'

const route = useRoute()
const router = useRouter()
const form = ref<{
  organizationId: string
  projectDomain: string
  projectType?: string
  projectName?: string
  projectTimezone?: string
  newOrganizationOwnerEmail: string
  newOrganizationOwner: '' | 'current' | 'client'
  declaration: boolean
  newOrganizationName: string
}>({
  projectDomain: '',
  organizationId: '',
  projectType: '',
  newOrganizationOwnerEmail: '',
  newOrganizationOwner: '',
  declaration: false,
  newOrganizationName: '',
  projectName: '',
})
const isValid = ref<boolean>(false)
const sending = ref(false)
const sent = ref(false)
const checking = ref<boolean>(false)

const clientEmailExists = ref<boolean>()

const emailLocked = computed<boolean>(() => {
  return !!(clientEmailExists.value === false || clientEmailExists.value)
})

const organizationId = computed<string>({
  get: () => route.query.organizationId as string,
  set: async (v) => {
    await router.replace({ query: { ...route.query, organizationId: v } })
  },
})

const orgList = computed(() => {
  const list = activeOrganizations.value
    .filter((org: Organization) => currentUserCan('manageOrganization', org))
    .map((org: Organization) => {
      return { name: org.organizationName, value: org.organizationId }
    })

  return [
    { name: 'Create New Organization', value: 'create' },
    { format: 'divider' },
    ...list,
  ]
})

// const organization = computed<Organization | undefined>(() => {
//   const org = activeOrganizations.value.find(
//     (_) => _.organizationId === organizationId.value,
//   )
//   return org
// })

const plan = computed<Plan | undefined>(() => {
  const organization = activeOrganizations.value.find(
    _ => _.organizationId === organizationId.value,
  )

  return organization?.plan
})

async function createAction(): Promise<void> {
  sending.value = true

  const r = await requestManageEndpoint('createProject', {
    ...form.value,
    organizationId: organizationId.value,
  })
  sending.value = false

  if (r.status === 'success')
    await router.push(getRoute('trackingCode', { projectId: r.projectId }))
}

async function setUserEmailExists(): Promise<void> {
  const ownerEmail = form.value.newOrganizationOwnerEmail

  if (!ownerEmail)
    return

  checking.value = true

  const r = await requestUserEndpoint('getPublicUser', {
    email: ownerEmail,
  })

  clientEmailExists.value = !!r.data

  checking.value = false
}

async function requestInvite(): Promise<void> {
  const user = currentUser()

  if (!user)
    return

  checking.value = true

  const { email, fullName } = user

  const r = await requestManageEndpoint('seekInviteFromUser', {
    email: form.value.newOrganizationOwnerEmail,
    requestingEmail: email,
    requestingName: fullName,
  })

  checking.value = false

  if (r.status === 'success')
    sent.value = true
}
</script>

<template>
  <ElemSlideOver name="newProject">
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
          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
        />
      </svg>
    </div>

    <div class="py-3">
      <h2 class="text-xl font-semibold">
        Add New Project
      </h2>
      <p class="text-slate-500">
        You can add an unlimited number of projects to your account as long as
        they are owned by your Organization.
      </p>
    </div>

    <ElemForm
      v-model:valid="isValid"
      :data="form"
      @submit="createAction()"
    >
      <ElemInput
        v-model="form.projectName"
        input="text"
        label="Project Name"
        description="Reference name for the website (optional)"
        @keyup.enter.stop="emitEvent('submit')"
      />
      <ElemInput
        v-model="form.projectDomain"
        input="domain"
        label="Project Website"
        description="Enter the primary website domain."
        required
        @keyup.enter.stop="emitEvent('submit')"
      />

      <ElemInput
        v-model="form.projectTimezone"
        input="timezone"
        label="Primary Timezone"
        description="For analytics dates and times"
        required
        @keyup.enter.stop="emitEvent('submit')"
      />
      <ElemInput
        v-model="form.projectType"
        input="selectCustom"
        label="Type / Category"
        description="This will help improve your experience (optional)"
        :list="projectTypes"
      />

      <ElemInput
        v-model="organizationId"
        input="selectCustom"
        label="Organization"
        description="The organization that will manage this site"
        default-text="Select Organization"
        :list="orgList"
        required
      />

      <template v-if="organizationId === 'create'">
        <ElemInput
          v-model="form.newOrganizationName"
          input="text"
          label="New Organization Name"
          description="You can change this later"
          required
          @keyup.enter.stop="emitEvent('submit')"
        />

        <ElemInput
          v-model="form.newOrganizationOwner"
          input="radio"
          label="New Organization Owner"
          description="Who will pay and manage this account?"
          :list="[
            {
              value: 'client',
              name: 'The client will pay and manage this organization account.',
            },
            {
              value: 'current',
              name: `I will pay for and manage the organization's account.`,
            },
          ]"
          required
        />
        <template v-if="form.newOrganizationOwner === 'client'">
          <ElemInput
            v-model="form.newOrganizationOwnerEmail"
            :disabled="emailLocked"
            input="email"
            label="Client Email Address"
            description="The email of who will own and pay for this organization"
            :class="emailLocked ? 'bg-gray-50  p-4' : ''"
            required
          >
            <template #after>
              <p v-if="emailLocked" class="my-2 text-sm text-right">
                <span
                  class="underline text-primary-500 cursor-pointer"
                  @click="
                    ;(clientEmailExists = undefined),
                      (form.newOrganizationOwnerEmail = '')
                  "
                >Change To Another Email</span>
              </p>
              <div v-if="clientEmailExists === undefined" class="my-4">
                <ElemButton
                  size="sm"
                  btn="default"
                  :loading="checking"
                  @click.prevent.stop="setUserEmailExists()"
                >
                  Invite Client &rarr;
                </ElemButton>
                <input
                  :value="emailLocked ? 'locked' : ''"
                  type="text"
                  class="h-1 w-1 opacity-0"
                  oninvalid="this.setCustomValidity('User invitation is required')"
                  onvalid="this.setCustomValidity('')"
                  required
                >
              </div>
              <template v-else-if="clientEmailExists">
                <div class="my-4">
                  <div class="font-semibold">
                    This email is associated with an existing user.
                  </div>
                  <div class="text-slate-500">
                    Send the user a request to give you access to an
                    organization.
                  </div>
                </div>
                <ElemButton
                  size="sm"
                  :loading="checking"
                  @click.prevent.stop="requestInvite()"
                >
                  Send Request &rarr;
                </ElemButton>
              </template>
              <template v-else>
                <div class="my-4">
                  <div class="font-semibold">
                    We'll invite {{ form.newOrganizationOwnerEmail }}
                  </div>
                  <div class="text-slate-500">
                    You'll get instant access to the new organization.
                  </div>
                </div>
              </template>
            </template>
          </ElemInput>
        </template>
      </template>

      <ElemButton
        type="submit"
        btn="primary"
        :loading="sending"
      >
        Create
        {{ form.organizationId === "create" ? "and Organization" : "" }}
        &rarr;
      </ElemButton>
    </ElemForm>
  </ElemSlideOver>
</template>
