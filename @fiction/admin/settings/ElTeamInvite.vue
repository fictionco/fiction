<script lang="ts" setup>
import type { FictionTeam } from '@fiction/core/plugin-team'
import type { MemberAccess } from '@fiction/core/plugin-user/types'
import type { Card } from '@fiction/site/card'
import { onResetUi, useService, vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import ElForm from '@fiction/ui/inputs/ElForm.vue'
import InputEmail from '@fiction/ui/inputs/InputEmail.vue'
import InputSelect from '@fiction/ui/inputs/InputSelect.vue'

defineProps<{ card: Card }>()

const { fictionUser, fictionTeam } = useService<{ fictionTeam: FictionTeam }>()
interface Invite {
  email: string
  memberAccess: MemberAccess
}

const form = vue.ref({})

const isValid = vue.ref<boolean>(false)
const sending = vue.ref(false)
const sent = vue.ref(false)

const defaultInvites = [
  { email: '', memberAccess: 'admin' },
  { email: '', memberAccess: 'admin' },
  { email: '', memberAccess: 'admin' },
] as const

const invites = vue.ref<Invite[]>([...defaultInvites])

async function sendInvites(): Promise<void> {
  if (isValid.value && fictionUser.activeOrgId.value) {
    const actualInvites = invites.value.filter(i => i.email)

    sending.value = true

    const r = await fictionTeam.requests.TeamInvite.request({
      orgId: fictionUser.activeOrgId.value,
      invites: actualInvites,
    })

    if (r.status === 'success') {
      invites.value = invites.value.map((_) => {
        return {
          email: '',
          memberAccess: 'admin',
        }
      })
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
        <div class="pb-12">
          <h2 class="text-xl font-bold">
            Add Team Members
          </h2>
          <p class="text-theme-500 mt-2">
            Invite people to the "{{
              fictionUser.activeOrganization.value?.orgName
            }}" Organization
          </p>
        </div>

        <ElForm
          v-model:valid="isValid"
          :data="form"
          @submit="send()"
        >
          <div class="mb-6 mt-4">
            <h2 class="mb-2 text-base font-bold">
              What will happen:
            </h2>
            <div class="font-media text-theme-500 text-sm">
              An email will be sent with a link, and the email will be granted access to this
              organization.
            </div>
          </div>

          <div class="w-full">
            <div
              class="invite-header text-theme-500 mb-2 grid grid-cols-5 gap-4 font-medium"
            >
              <div
                class="col-span-3 text-xs font-bold uppercase tracking-wider"
              >
                Email
              </div>
              <div
                class="col-span-2 text-xs font-bold uppercase tracking-wider"
              >
                Access
              </div>
            </div>

            <div
              v-for="(_item, i) in invites"
              :key="i"
              class="invite my-4 grid grid-cols-5 gap-4"
            >
              <InputEmail v-model="invites[i]!.email" class="col-span-3" ui-size="lg" />

              <InputSelect
                v-model="invites[i]!.memberAccess"
                class="col-span-2"
                ui-size="lg"
                :list="[
                  { value: 'owner', name: 'Owner' },
                  { value: 'admin', name: 'Admin' },
                  { value: 'editor', name: 'Editor (Tools Only)' },
                ]"
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
