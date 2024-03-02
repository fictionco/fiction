<script lang="ts" setup>
import ElForm from '@factor/ui/ElForm.vue'
import InputEmail from '@factor/ui/InputEmail.vue'
import InputSelect from '@factor/ui/InputSelect.vue'
import ElButton from '@factor/ui/ElButton.vue'
import ElPanel from '@factor/ui/ElPanel.vue'
import type { MemberAccess } from '@factor/api/plugin-user/types'
import type { FactorUser } from '@factor/api'
import { onResetUi, useService, vue } from '@factor/api'
import AdminPage from '../../plugin-admin/AdminPage.vue'
import type { FactorTeam } from '..'

const { factorUser, factorTeam } = useService<{
  factorUser: FactorUser
  factorTeam: FactorTeam
}>()
interface Invite {
  email: string
  memberAccess: MemberAccess
}

const form = vue.ref({})

const isValid = vue.ref<boolean>(false)
const sending = vue.ref(false)
const sent = vue.ref(false)

const defaultInvites = [
  {
    email: '',
    memberAccess: 'admin',
  },
  {
    email: '',
    memberAccess: 'admin',
  },
  {
    email: '',
    memberAccess: 'admin',
  },
] as const

const invites = vue.ref<Invite[]>([...defaultInvites])

async function sendInvites(): Promise<void> {
  if (isValid.value && factorUser.activeOrganizationId.value) {
    const actualInvites = invites.value.filter(i => i.email)

    sending.value = true

    const r = await factorTeam.requests.TeamInvite.request({
      organizationId: factorUser.activeOrganizationId.value,
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
  <AdminPage>
    <template #actions />

    <ElPanel title="Invite People to Organization">
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
            <ElButton btn="primary" @click="sent = false">
              Invite More &rarr;
            </ElButton>
          </div>
        </div>

        <div v-else class="m-8">
          <div class="pb-12">
            <h2 class="text-xl font-extrabold">
              Invite people to the "{{
                factorUser.activeOrganization.value?.organizationName
              }}" Organization
            </h2>
            <p class="text-theme-500 mt-2">
              Invited members will be granted access to all projects under the
              selected organization.
            </p>
          </div>

          <ElForm
            v-model:valid="isValid"
            :data="form"
            @submit="send()"
          >
            <div class="mb-6 mt-4">
              <h2 class="text-base font-extrabold">
                What will happen:
              </h2>
              <div class="font-media text-theme-500 text-sm">
                An email will be sent with a sign up link, access to this
                organization, and text letting the person know you've invited
                them.
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
                <InputEmail v-model="invites[i].email" class="col-span-3" />

                <InputSelect
                  v-model="invites[i].memberAccess"
                  class="col-span-2"
                  :list="[
                    { value: 'owner', name: 'Owner' },
                    { value: 'admin', name: 'Admin' },
                    { value: 'editor', name: 'Editor (Tools Only)' },
                  ]"
                />
              </div>
            </div>

            <div class="my-8">
              <ElButton
                input="submit"
                btn="primary"
                :loading="sending"
              >
                Send Invites &rarr;
              </ElButton>
            </div>
          </ElForm>
        </div>
      </div>
    </ElPanel>
  </AdminPage>
</template>
