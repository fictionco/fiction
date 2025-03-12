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
      memberAccess: 'admin' as MemberAccess,
    }
  })
})

async function sendInvites(): Promise<void> {
  if (isValid.value && fictionUser.activeOrgId.value) {
    const actualInvites = invites.value.filter(i => i.email)

    sending.value = true

    const r = await fictionTeam.requests.TeamInvite.request({
      orgId: fictionUser.activeOrgId.value,
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
        <div class="py-3">
          <h2 class="text-xl font-semibold">
            Invite Sent!
          </h2>
          <p class="text-theme-500">
            We sent invite emails sent to the email addresses you provided.
          </p>
        </div>
        <div class="mt-6">
          <XButton theme="primary" @click="sent = false">
            Invite More &rarr;
          </XButton>
        </div>
      </div>

      <div v-else class="m-8">
        <div>
          <h2 class="text-xl font-bold">
            Add Members to Workspace
          </h2>
          <p class="text-theme-500 mt-2">
            Send invite to the "{{ fictionUser.activeOrganization.value?.orgName }}" Workspace
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
                label="Emails"
                sub-label="Emails of the people you want to invite"
                input="InputEmailMulti"
                ui-size="lg"
              />
            </div>
          </div>

          <div class="my-8 flex flex-end">
            <XButton
              input="submit"
              theme="primary"
              :loading="sending"
              size="lg"
            >
              Send Invites &rarr;
            </XButton>
          </div>
        </ElForm>
      </div>
    </div>
  </div>
</template>
