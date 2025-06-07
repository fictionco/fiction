<script lang="ts" setup>
import type { FictionTeam } from '@fiction/core/plugin-team'
import type { MemberAccess } from '@fiction/core/plugin-user/types'
import type { Card } from '@fiction/site/card'
import { onResetUi, useService, vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import ElInput from '@fiction/ui/inputs/ElInput.vue'

defineProps<{ card: Card }>()

const { fictionUser, fictionTeam } = useService<{ fictionTeam: FictionTeam }>()

const form = vue.ref({})

const isValid = vue.ref<boolean>(false)
const sending = vue.ref(false)
const sent = vue.ref(false)

const emails = vue.ref<string[]>([])

const invites = vue.computed(() => {
  return emails.value.map((email) => {
    return {
      email,
      access: 'admin' as MemberAccess,
    }
  })
})

async function sendInvites(): Promise<void> {
  if (isValid.value && fictionUser.activeOrgId.value) {
    const actualInvites = invites.value.filter(i => i.email)

    sending.value = true

    const r = await fictionTeam.requests.TeamInvite.projectRequest({
      invites: actualInvites,
    })

    if (r.status === 'success') {
      emails.value = []
      sent.value = true
    }

    sending.value = true
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
  <div>
    <div class="max-w-2xl">
      <div v-if="sent" class="m-8">
        <div class="py-3 space-y-1">
          <h2 class="text-xl font-semibold">
            Invitations Sent Successfully!
          </h2>
          <p class="text-theme-500">
            Your team members will receive email invitations to join the workspace. They can accept by clicking the link in the email.
          </p>
        </div>
        <div class="mt-6">
          <XButton theme="primary" @click="sent = false">
            Invite More People
          </XButton>
        </div>
      </div>

      <div v-else class="m-8">
        <div>
          <h2 class="text-xl font-bold">
            Invite Team Members
          </h2>
          <p class="text-theme-500 mt-2">
            Add people to collaborate with you in the "{{ fictionUser.activeOrganization.value?.name }}" workspace
          </p>
        </div>

        <ElForm
          v-model:valid="isValid"
          :data="form"
          @submit="send()"
        >
          <div class="w-full">
            <div
              class="invite my-4 space-y-4"
            >
              <ElInput
                v-model="emails"
                data-test-id="invite-email-input"
                label="Email Addresses"
                sub-label="Enter one or more email addresses (separated by commas or new lines)"
                input="InputEmailMulti"
                ui-size="lg"
              />
            </div>
          </div>

          <div class="my-8 flex flex-end">
            <XButton
              data-test-id="send-invites-button"
              input="submit"
              theme="primary"
              :loading="sending"
              size="lg"
              :disabled="!emails.length"
            >
              {{ sending ? 'Sending Invitations...' : 'Send Invitations' }}
            </XButton>
          </div>
        </ElForm>
      </div>
    </div>
  </div>
</template>
