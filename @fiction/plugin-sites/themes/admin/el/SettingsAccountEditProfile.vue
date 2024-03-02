<script lang="ts" setup>
import type { User, UserMeta } from '@fiction/core'
import { useService, vue } from '@fiction/core'
import ElInput from '@fiction/ui/ElInput.vue'
import ElButton from '@fiction/ui/ElButton.vue'

import type { Card } from '../../../card'

defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
})

const { factorUser } = useService()

const formError = vue.ref('')
const user = vue.computed<Partial<User>>(
  () => factorUser.activeUser.value || {},
)
const form = vue.ref<Partial<User>>(user.value)
const userMeta = vue.ref<Partial<UserMeta>>({})
const sending = vue.ref(false)
const sent = vue.ref(false)

async function updateUser(): Promise<void> {
  const fields = { ...form.value, meta: userMeta.value }

  const r = await factorUser.requests.ManageUser.projectRequest({
    _action: 'update',
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

vue.onMounted(async () => {
  await factorUser.userInitialized()
  vue.watch(
    () => factorUser.activeUser.value,
    (v) => {
      if (v) {
        form.value = v
        userMeta.value = v.meta ?? {}
      }
    },
    { immediate: true },
  )
})
</script>

<template>
  <div>
    <div class="grid grid-cols-2">
      <div class="space-y-6">
        <ElInput
          v-model="form.fullName"
          input="InputText"
          label="Full Name"
          placeholder="Name"
          required
        />
        <ElInput
          v-model="form.username"
          input="InputText"
          label="Username"
          sub-label="Must be unique. Used in profile URL."
          placeholder="my-username"
          required
        />

        <ElInput
          v-model="userMeta.location"
          input="InputText"
          label="Location"
          placeholder="Location"
        />

        <ElInput
          v-model="userMeta.bio"
          input="InputTextarea"
          label="Bio"
          placeholder=""
          :rows="6"
        />
      </div>

      <div class="space-y-6">
        <ElInput
          v-model="userMeta.site"
          input="InputUrl"
          label="Website"
          placeholder="https://www.example.com"
        />

        <ElInput
          v-model="userMeta.calendarUrl"
          input="InputUrl"
          label="Calendar/Meeting Url (E.g. Calendly)"
          placeholder="https://www.calendly.com/username"
        />

        <ElInput
          v-model="userMeta.twitter"
          input="InputUrl"
          label="Twitter Profile"
          placeholder="https://www.twitter.com/username"
        />

        <ElInput
          v-model="userMeta.github"
          input="InputUrl"
          label="Github Profile"
          placeholder="https://www.github.com/username"
        />

        <ElInput
          v-model="userMeta.linkedin"
          input="InputUrl"
          label="LinkedIn Profile"
          placeholder="https://www.linkedin.com/in/username"
        />
      </div>
    </div>
    <div class="mt-6">
      <ElButton
        btn="primary"
        :loading="sending"
        @click="send()"
      >
        Save Changes
      </ElButton>
    </div>
  </div>
</template>
