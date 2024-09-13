<script lang="ts" setup>
import type { User } from '@fiction/core'
import type { Card } from '@fiction/site/card'
import { useService, vue } from '@fiction/core'
import ElButton from '@fiction/ui/ElButton.vue'
import ElInput from '@fiction/ui/inputs/ElInput.vue'

defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
})

const { fictionUser } = useService()

const formError = vue.ref('')
const user = vue.computed<Partial<User>>(
  () => fictionUser.activeUser.value || {},
)
const form = vue.ref<Partial<User>>(user.value)

const sending = vue.ref(false)
const sent = vue.ref(false)

async function updateUser(): Promise<void> {
  const fields = { ...form.value }
  const r = await fictionUser.requests.ManageUser.projectRequest({
    _action: 'updateCurrentUser',
    fields,
  })

  if (r.status !== 'success')
    formError.value = r.message ?? ''
}

async function send(): Promise<void> {
  sending.value = true
  await updateUser()
  sending.value = false
  sent.value = true
}

vue.watch(
  () => fictionUser.activeUser.value,
  (v) => {
    if (v)
      form.value = v
  },
)
</script>

<template>
  <div>
    <div class="max-w-lg space-y-6">
      <ElInput
        v-model="form.fullName"
        input="InputText"
        label="Full Name"
        placeholder="Enter your full name"
        required
      />
      <ElInput
        v-model="form.username"
        input="InputUsername"
        label="Username"
        sub-label="Must be unique. Used in profile URL."
        placeholder="username123"
        table="fiction_user"
        :columns="[{ name: 'username' }]"
        required
      />

      <ElInput
        v-model="form.email"
        input="InputEmail"
        label="Email Address"
        placeholder="email@example.com"
        disabled
      >
        <template #after>
          <div class="mt-4">
            <ElButton
              btn="default"
              size="sm"
              :href="card.link('/settings/change-credential?mode=email')"
            >
              Change Email &rarr;
            </ElButton>
          </div>
        </template>
      </ElInput>
      <ElInput label="Password">
        <ElButton
          btn="default"
          size="sm"
          :href=" card.link('/settings/change-credential?mode=password')"
        >
          Change Password &rarr;
        </ElButton>
      </ElInput>
      <ElInput
        v-model="form.phone"
        input="InputPhone"
        label="Phone Number"
        sub-label="Used for SMS notifications"
        placeholder="+1 555 555 5555"
      />
      <div>
        <ElButton
          btn="primary"
          :loading="sending"
          @click="send()"
        >
          Save Changes
        </ElButton>
      </div>
    </div>
  </div>
</template>
