<script lang="ts" setup>
import type { Card } from '@fiction/site/card'
import type { User } from '@fiction/core'
import { useService, vue } from '@fiction/core'
import ElInput from '@fiction/ui/inputs/ElInput.vue'
import ElButton from '@fiction/ui/ElButton.vue'

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

vue.onMounted(async () => {
  await fictionUser.userInitialized({ caller: 'SettingsAccountEditProfile' })
  vue.watch(
    () => fictionUser.activeUser.value,
    (v) => {
      if (v) {
        form.value = v
      }
    },
    { immediate: true },
  )
})
</script>

<template>
  <div>
    <div class="grid grid-cols-2 gap-4">
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
